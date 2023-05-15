const super_secret_email_address = "WW05MVpHVnliR2x4ZFdWb1FHZHRZV2xzTG1OdmJRPT0="
const email_btn                  = document.getElementById("email_btn");

email_btn.href = `mailto: ${atob(atob(super_secret_email_address))}?subject=Job Opportunity&body=Hello Hugo.%0d%0a%0d%0aI am pleased to let you know that we have a job opportunity for you, with a base salary of $1,000,000 per year.%0d%0a%0d%0aPlease reach back to us if you are interested.%0d%0a%0d%0aKind Regards.`;