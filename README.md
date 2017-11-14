# Stack-on-Slack

A very simple Slack integration that allows you to search Stack Overflow right from within Slack.

This project makes use of the [Stack Exchange](http://api.stackexchange.com/docs) to fetch the best responses for users' requests.

### Getting it up and running

Stack-on-Slack is simply a Slack slash command. There are a number of good materials on creating Slack slash commands out there, like
[this one](https://scotch.io/tutorials/create-a-custom-slack-slash-command-with-nodejs-and-express).

You can start by creating a [Slack application](https://api.slack.com/apps).  
![Create an app](https://cdn.scotch.io/22/QcAXa0vQNKOtvC7KjF6X_02-slack-create-new-app-screenshot.jpg)

Select the option for **Slash Commands**.  
![Slash commands](https://cdn.scotch.io/22/WTx4OVXfS8WtkpjD3VWo_03-slack-create-slash-command-screenshot.jpg)

Supply the necessary pieces of information.  
![Slash command](https://cdn.scotch.io/22/z0J6ZaLS2avTRMd7vrK9_04-slack-create-slash-command-options-screenshot.jpg)  
The first 2 fields are the most important.
* **Command** is where you specify what slash command you want to use. For this project I often use */so*.
* **Request URL** is where you specify the endpoint to which Slack will send a *POST* request whenever a user invokes your command on Slack. One of my deployments uses [https://stack-on-slack.herokuapp.com/](https://stack-on-slack.herokuapp.com/). (Don't bother using this URL as it will ignore every request coming in from an unrecognized source.)

Install the application, making sure to grant it the required access to Slack.  
![Install app](https://cdn.scotch.io/22/bW0GaGTtSJ68JbEUPh7Y_05-slack-install-app-screenshot.jpg)

App credentials will be created for the app. Take note of the **Verification Token** as you will need to store its value in the environment variable *SLACK_VERIFICATION_TOKEN*. This token is used by Slack-on-Stack to verify the source of an incoming request before proceeding to handle the event.

That's basically it on the Slack side of things. What is left now is running the server contained in this project, and making it accessible via the **Request URL** specified earlier.

Host this server on any platform of your choice. I tend to go for Heroku. Note that you will have to clone this repo to your file system at this point. There are a number of good materials on hosting Node servers on Heroku out there, like
[this one](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction). Do not forget to create the environment variable *SLACK_VERIFICATION_TOKEN*.

Once your server is up and running users can then begin interacting with your slash command.

### Possible error on Slack

Once in a while (actually quite often) youn may see this on Slack:  
![Slack timeout error](https://s3.us-east-2.amazonaws.com/franklin-chieze/slack-timeout-error.png)

The above error simply means the server is asleep on Heroku. It takes a few seconds for Heroku to wake the app up. Unfortunately Slack isn't that patient, and throws the error above. As soon as the app comes up, it processes your request, and normal operation resumes.