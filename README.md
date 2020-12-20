# Alexa "Song Match" Quiz
![](images/ReadMeBanner.png)

Alexa quiz created using JavaScript and Node.js in the Alexa Developer Console

## Table of Contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Design Choice](#design-choice)
* [Supported Artists](#supported-artist)

## General info
This quiz matches the user to a song of their choice of artist based on their selections in the Alexa environment.

## Technologies
Project is created with:
* JavaScript
* Node.js
* Alexa Developer Console

## Setup
* Open Alexa Developer Console and paste index.js into the corresponding file, other files were unchanged.
* Set up the necessary intents shown in models/intents.json.

## Features
* Starts a "Song Match" quiz.
* Asks a series of questions and matches a song.
* Provides a list of commands.
* Repeats the last statement.
* Stops the quiz.

## Design Choice
* The instructions are not automatically provided in the beginning since many people know the rules already and might be annoyed.
* Alexa will respond differently to the same utterances depending on whether in quiz or not.
* I chose not to use AMAZON.Musician due to the many unwanted utterance conflicts.

## Supported Artists
* Ariana Grande
* Blue
* Train
* Billy Joel
* Bon Jovi
* More to be added...
