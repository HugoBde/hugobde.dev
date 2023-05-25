# Powering a contact form with Go and Docker
## Intro
The first version of my website was originally published using GitHub pages. While it was a convenient way of creating a simple portfolio website, I quickly felt the need for additional features. The most important requirement was without a doubt providing a simple way to reach out to me to share an idea or enquire about something.

The simplest solution would have been to use a `mailto:` link, but I was not comfortable with the idea of having my email address out there, waiting to be scraped by a web crawler. At the time, I eventually managed to come up with a cloud based solution using AWS API Gateway and AWS Simple Email Service. However, after my AWS Free Tier subscription expired, I was forced to take down my beloved contact form.

Recently, I decided to break the bank and have my website hosted a dedicated server, meaning that I now had access to a backend which could safely send enquiries to my email inbox. The present blog post describes how I implemented this solution.

## Original set up
With my website consisting in a few static files at the time of hosting it, I chose to use Nginx as a simple drop-in solution. With very little configuration to do, I was up and running in no time, and had the routing requests to future backend services using the reverse-proxy functionality.

![Original set up diagram](https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png) 

## The plan
Below you can a simplistic representation of the system we will be implementing. Nginx receives POST requests to /contact_form and proxies them to an arbitrary port on which my microservice will be listening.

![msgme flowdiagram](https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png)

For this project, I chose to use Go to implement my service because its standard library has plenty of support for network protocols - specifically the Simple Mail Transfer Protocol - and HTTP(S) server functionalities. Down the line, we will be containerising our microservice to ~flex our DevOps skills~ simplify deployment, using Docker.

## Implementation
Enough talking, time to get coding! Let's create our project: 


    $ mkdir msmge_uservice
    $ cd msgme_uservice
    $ go mod init <module path>

Here, I called my project `msgme_uservice` but you can pick any name. Also note that if you are creating your project in the GOPATH, you can omit the module path. Otherwise, you probably will want to use the address of the repository storing your module for good measure.

Next, let's add a library to your project: `godotenv` which will enable us to use a `.env` file to store our credentials down the line.
    
    $ go get github.com/joho/godotenv


    