# Powering a contact form with Go and Docker
## Intro
The first version of my website was originally published using GitHub pages. While it was a convenient way of creating a simple portfolio website, I quickly felt the need for additional features. The most important requirement was without a doubt providing a simple way to reach out to me to share an idea or enquire about something.

The simplest solution would have been to use a `mailto:` link, but I was not comfortable with the idea of having my email address out there, waiting to be scraped by a web crawler. At the time, I eventually managed to come up with a cloud based solution using AWS API Gateway and AWS Simple Email Service. However, after my AWS Free Tier subscription expired, I was forced to take down my beloved contact form.

Recently, I decided to break the bank and have my website hosted a dedicated server, meaning that I now had access to a backend which could safely send enquiries to my email inbox. The present blog post describes how I implemented this solution.

### Original setup
With my website consisting of a few static files at the time of hosting it, I chose to use Nginx as a simple drop-in solution. With very little configuration to do, I was up and running in no time, and had the routing requests to future backend services using the reverse-proxy functionality.

![Original set up diagram](https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png) 

### The plan
Below you can see a simplistic representation of the system we will be implementing. Nginx receives POST requests to /contact_form and proxies them to an arbitrary port on which my microservice will be listening.

![msgme flowdiagram](https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png)

For this project, I chose to use Go to implement my service because its standard library has plenty of support for network protocols - specifically the Simple Mail Transfer Protocol - and HTTP(S) server functionalities. In the end, we will be containerising our microservice to ~~flex our DevOps skills~~ simplify deployment, using Docker.

## Implementation

### Set up
Enough talking, time to get coding! Let's create our project: 
```sh
$ mkdir msmge_uservice
$ cd msgme_uservice
$ go mod init <module path>
```
Here, I called my project `msgme_uservice` but you can pick any name. Also note that if you are creating your project in the GOPATH, you can omit the module path. Otherwise, you probably will want to use the address of the repository storing your module for good measure.

Next, let's add a library to your project: `godotenv` which will enable us to use a `.env` file to store our credentials and other stuff.
```sh
$ go get github.com/joho/godotenv
```
Now, let's create our `.env` file. If you are thinking of showing this project off on GitHub, make sure you add the `.env` file to your `.gitignore` so that you don't accidentally share your credentials with the whole world. Here's what the file should look like for the moment:
```dotenv
PORT=3000
```
We'll only specify which port to listen to for the moment as an example.

Finally, create a **Go** file in your favourite text editor or IDE and add some boilerplate code:
```go
//msgme.go
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Failed to load .env file: %s", err)
	}

	var valid bool
	var port_num string

	if port_num, valid = os.LookupEnv("PORT"); !valid {
		log.Fatal("Missing PORT environment variable")
	}

	log.Fatal(http.ListenAndServe(":"+port_num, nil))
}
```
You can compile the code to make sure everything is fine, although it doesn't do much yet.

### Sending an email
This article will focus on sending an email using **Gmail**. Google requires app have an **"application password"** to connect to our email account. A guide on how to obtain an application password for your own app can be found [here](https://support.google.com/accounts/answer/185833?hl=en).

Once you have acquired your oh-so-precious application password, time to a few variables to our `.env` file:
```dotenv
AUTH_USERNAME=<your Gmail address associated with the app password>
APPLICATION_PASSWORD=<your app password>
AUTH_SERVER=smtp.gmail.com
SENDER=<the sending email address>
RECIPIENT=<the email address to send the message to>
SENDING_SERVER=smtp.gmail.com:587
```
Note that `AUTH_USERNAME` and `SENDER` will be the same in all use cases from what I know, but I separated them just in case.

Now, let's create a function to handle our request. The method we will use to send emails using the SMTP implementation from the Go standard library requires us to create an `Auth` object. We can avoid creating a new object for every request by taking advantage of Go's **function closures** as below:
```go
//msgme.go

//...

import (
    "log"
    "net/http"
    "net/smtp"  // Add the net/smtp package
    "os"

    "github.com/joho/godotenv"
)

// ...

func generateRequestHandler() func(http.ResponseWriter, *http.Request) {
    var valid bool

    // Environment variables
    var app_pwd string
    var username string
    var auth_server string
    var sender string
    var recipient string
    var sending_server string

    // Read environment variables
    if app_pwd, valid = os.LookupEnv("APPLICATION_PASSWORD"); !valid {
        log.Fatal("APPLICATION_PASSWORD environment variable not set")
    }

    // Repeat for all the other environment variables above 

    // Create our Auth object. The first parameter "identity" can be omitted
    auth := smtp.PlainAuth("", username, app_pwd, auth_server)

    return func (w http.ResponseWriter, r *http.Request) {
        // This function will capture the variables in genereateRequestHandler
    }
}

// ...

func main() {

    // ...

    // Create a handler using our closure generator
    requestHandler := generateRequestHandler()

    // Route handler to the path of your choice
    http.HandleFunc("/", requestHandler)

	log.Fatal(http.ListenAndServe(":"+port_num, nil))
}
```

Now, let's focus on the request handling code itself. For this example, the request handler is called when submitting a form with 4 fields, `contact_name`, `contact_email`, `contact_phone_no` and `msg_body`, using the POST method.

```go
func generateRequestHandler() func(http.ResponseWriter, *http.Request) {

    // ...

    // Create our Auth object. The first parameter "identity" can be omitted
    auth := smtp.PlainAuth("", username, app_pwd, auth_server)

    return func (w http.ResponseWriter, r *http.Request) {
        // Ensure we called using a POST method
        if r.Method != "POST" {
            w.WriteHeader(405)
            return
        }

        // Parse the request form data into r.PostForm, which we'll retrieve using r.FormValue
        if err := r.ParseForm(); err != nil {
            logger.Error(err)
            w.WriteHeader(500)
            return
        }

        // Build message from form data
        msg := []byte(fmt.Sprintf("Subject: Website Enquiry Form\r\nFrom: hugobde.dev\r\nTo: %s\r\n\r\nName: %s\r\nContact Email: %s\r\nContact Phone Number: %s\r\n\r\nBody: %s",
            recipient,
            r.FormValue("contact_name"),
            r.FormValue("contact_email"),
            r.FormValue("contact_phone_no"),
            r.FormValue("msg_body")))

        // Send Email to myself
        err := smtp.SendMail(sending_server, auth, sender, []string{recipient}, msg)

        if err != nil {
            logger.Error(err)
            w.WriteHeader(500)
            return
        }
    }
}
```
And *voilà*! A slightly improved version of this source code can be found on [GitHub](https://github.com/HugoBde/msgme/blob/master/msgme.go). Now it's time to play with Docker.