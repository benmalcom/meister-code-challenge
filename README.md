# MeisterLabs JavaScript Challenge

## Structure

- `/` - An instance of [create-react-app](https://github.com/facebook/create-react-app)
- `/src/Client.js` - Renders the UI, sends requests to the server
- `/src/Server.js` - A simple Server mocking AJAX requests with added latency
- `/src/utils/Persons.js` - Shared code between the Client and Server

## App Overview

Our App primarily shows a list of "persons" - each person is an object containing `id` and `name` properties.

You are able to create new entries by clicking on the "Create Person" button and you are able to rename each person, after clicking the respective "Save Name" buttons.

The App features "optimistic updates", meaning that we do not wait for responses from our Server, but rather display the results immediately. When any response does arrive later on, we patch the Client state as necessary.

## Issues

Here are the issues you need to find solutions for:

- [] In the current implementation, creating a new person will result with two persons being displayed on the Client

- [] Editing the name of person that has not been persisted on the Server yet (visible by a negative ID on the left side) will result with a new person being created

- [] Editing the name of a person multiple times in quick succession may result with a random name ending up on the Client, due to the latency

- [] Editing the name of a person multiple times in quick succession, for example once to "123" and then to "456", will result with the App showing "456", then as the response for the first request arrives "123", later on again "456" for the second request - we want to show only the last version the user has submitted

## Rules / Notes

- Do not block user interaction, eg. by disabling buttons or showing loading spinners, keep the optimistic updates intact!

- Do not modify the Server, you will not always have the luxury of being able to do so

- You are free to pick your weapons of choice, for example if you do not feel comfortable with React, want to solve the issue with Redux, or want to use other tooling

- If you wish, you can modify the UI and styling

- We will be testing your submission in Chrome, don't worry about IE or other browsers

- You are free to ask us any questions you might have

- Please make sure to not include `node_modules` with your submission

Good luck! :)