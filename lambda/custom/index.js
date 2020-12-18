const Alexa = require('ask-sdk-core');
let lastStatement, counter, inQuiz, artistName, random, item;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        lastStatement = welcomeMessage;
        inQuiz = false;
        return handlerInput.responseBuilder
            .speak(welcomeMessage)
            .reprompt(repromptMessage)
            .getResponse();
    }
};

const StartQuizIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartQuizIntent'
            && inQuiz === false;
    },
    handle(handlerInput) {
        counter = 0;
        inQuiz = true;
        lastStatement = 'Please tell me the name of your favorite artist.';
        return handlerInput.responseBuilder
            .speak('Please tell me the name of your favorite artist.')
            .reprompt('Please tell me the name of your favorite artist.')
            .getResponse();
    }
};

const ArtistAnswerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ArtistAnswerIntent'
            && inQuiz === true;
    },
    handle(handlerInput) {
        artistName = handlerInput.requestEnvelope.request.intent.slots.artistName.value.toString();
        let speakOutput = `Great. ${artistName}. Now please answer these three questions to help me match you to an ${artistName} song. `
        + getQuestion(handlerInput) + getSelections(handlerInput) + '?';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const QuizAnswerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'QuizAnswerIntent'
            && inQuiz === true;
    },
    handle(handlerInput) {
        let speakOutput = `Got it. Question ${counter},` + getQuestion(handlerInput) + getSelections(handlerInput) + '?';
        if (counter === 3) {
            
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const RepeatIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(lastStatement)
            .reprompt(repromptMessage)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        lastStatement = repromptMessage;
        return handlerInput.responseBuilder
            .speak(repromptMessage)
            .reprompt(repromptMessage)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {

        return handlerInput.responseBuilder
            .speak(exitSkillMessage)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);
        console.log(error);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/* CONSTANTS */

const welcomeMessage = `Welcome to Song Match. I can help you understand which song by your favorite artist best matches your life.
        You can ask me to start a quiz or to read the instructions, what would you like to do?`;
const repromptMessage = `You can ask me to start a quiz or to
        read the instructions, what would you like to do?`;
const instructionMessage = `Tell me the name of your favorite artist, then answer three questions and I'll help match you to one of their songs.`;
const exitSkillMessage = `Thank you for using Song Match. For another great skill, check out Song Quiz!`;
const speechCons = ['Great', 'All righty', 'Got it', 'Gotcha', 'Awesome'];
const data = [
    {Question: 'What is your favorite color?', Selections: ['red', 'blue', 'yellow']},
    {Question: 'How are you feeling right this moment?', Selections: ['Curious', 'Sad', 'Happy', 'Anxious']},
    {Question: 'Which emoji do you prefer?', Selections: ['Black Hearts', 'White Clouds']},
    {Question: 'What is your best quality?', Selections: ['Intelligence', 'Charisma', 'Independence', 'Empathy']},
    {Question: 'Which place do you want to visit the most?', Selections: ['Paris', 'Las Vegas', 'Tokyo']},
];
/* HELPER FUNCTIONS */

function getRandom(min, max) {
  return Math.floor((Math.random() * ((max - min) + 1)) + min);
}

function getQuestion(handlerInput) {
  //GENERATING THE RANDOM QUESTION FROM DATA
  random = getRandom(0, data.length - 1);
  item = data[random];
  return item.Question;
}

function getSelections(handlerInput) {
    let selections = ' ';
  for (var i = 0; i < item.Selections.length; ++i) {
      selections += item.Selections[i];
      if (item.Selections.length - i > 1) {
          selections += ', ';
          if (item.Selections.length - i === 2) {
          selections += 'or ';
        }
      }
  }
  return selections;
}

function selectionMatched() {
    for (var i = 0; i < item.Selections.length; ++i) {
      if () {
          return true;
      }
    }
  }
    return false;
} 

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        StartQuizIntentHandler,
        ArtistAnswerIntentHandler,
        QuizAnswerIntentHandler,
        RepeatIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
