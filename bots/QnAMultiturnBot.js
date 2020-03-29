// Copyright (c) Microsoft Corporation. All rights reserved.

const { ActivityHandler, MessageFactory, ActionTypes, CardFactory } = require('botbuilder');

const welcomeCard = require('../resources/WelcomeCard.json');
const welcomeCard1 = require('../resources/WelcomeCard1.json');
const guidanceCard = require('../resources/GuidanceCard.json');

const WELCOMED_USER = 'welcomedUserProperty';
//const WELCOMED_USER_STATUS = 'welcomedStatus';
const USER_PROFILE_PROPERTY = 'userProfile';

class QnAMultiturnBot extends ActivityHandler {

    constructor(conversationState, userState, dialog) {
        super();
        if (!conversationState) throw new Error('[QnAMultiturnBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[QnAMultiturnBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[QnAMultiturnBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');
        this.welcomedState = this.conversationState.createProperty('WelcomedState');
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);
        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);


        this.onMessage(async (context, next) => {
            console.log('\n_Running dialog with Message Activity.');
            await this.dialog.run(context, this.dialogState);
            await next();
            });

        this.onMessage(async (context, next) => {

           const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);

           if (didBotWelcomedUser == 0)  //FALSE - FIRST WELCOME
                {
                //await context.sendActivity('For the first message to this chatbot, we shall display here how the chatbot works.');
                
                //await this.sendWelcomeCard(context);
                //await context.sendActivity("Welcome");
                    
                 welcomeCard.body[1].text = 'Welcome to FIDICchatbot';
                 welcomeCard.body[2].text = 'The chatbot allows you to search FIDIC contracts.';
                 welcomeCard.body[3].text = 'Submit "start" or "help" anytime to start again and for help.';
                 welcomeCard.body[4].text = 'After selecting a contract, General Conditions clauses are displayed by submitting a clause number or a keyword.';
                 welcomeCard.body[5].text = 'Keywords search the index of clauses, or in the General Conditions when searching is activated (by submitting \"c1s\" or \"start\" -> \"c1 s\" for the Construction Contract).';
                 welcomeCard.body[6].text = 'Shortcut codes for contracts that can be submitted at any time are "c1" for Construction Contract 1st Ed 1999 and "p1" for Plant & Design-Build Contract 1st Ed 1999 (in the process of being uploaded).';
                 welcomeCard.body[7].text = '[FIDICchatbot](https://fidic.tips/chatbot) is complemented by [FIDICbot](https://fidic.tips/bot) that suppplies messenging channels (e.g., LINE and Viber) that are not served by FIDICchatbot. Both bots are developed by Bricad Associates, Switzerland, as part of the [FIDIC.tips](https://FIDIC.tips) initiative.';

                 await context.sendActivity({attachments: [CardFactory.adaptiveCard(welcomeCard)]});
                 
                 var reply = MessageFactory.suggestedActions(['start'], 'Please submit "start" to start.');
                 await context.sendActivity(reply);   

                 await this.welcomedUserProperty.set(context, 1);
                 const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);
                 console.log ("\n_48 didBotWelcomedUser = " + didBotWelcomedUser);

                 } 
                 else if (didBotWelcomedUser == 1)
                 {  
 
                 await this.welcomedUserProperty.set(context, 2);
             
                 guidanceCard.body[1].text = 'FIDICchatbot guide';
                 guidanceCard.body[2].text = 'After selecting a contract, General Conditions clauses are displayed by submitting a clause number or a keyword.';
                 guidanceCard.body[3].text = 'Keywords search the index of clauses, or in the General Conditions when searching is activated (by submitting \"c1s\" or \"start\" -> \"c1 s\" for the Construction Contract).';
                 guidanceCard.body[4].text = 'Shortcut codes for contracts that can be submitted at any time are "c1" for the Construction Contract 1st Ed 1999 and "p1"for the Plant & Design-Build Contract 1st Ed 1999 (in the process of being uploaded).';
                 
                 await context.sendActivity({attachments: [CardFactory.adaptiveCard(guidanceCard)]});
                    
                 var reply = MessageFactory.suggestedActions(['start'], 'Please submit "start" to start.');
                 await context.sendActivity(reply);  
               
               }

        await next();

        });

        this.onMembersAdded(async (context, next) => { 
            
            console.log ("\n_86 in onMembersAdded");
            
            const membersAdded = context.activity.membersAdded;

            for (let cnt = 0; cnt < membersAdded.length; cnt++) {

                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    
                    console.log ("\n_94 this.userProfileAccessor.profileName = " + this.userProfileAccessor.profileName)

                    await this.welcomedUserProperty.set(context, 2);

                    welcomeCard1.body[1].text = 'Welcome to FIDICchatbot';
                    welcomeCard1.body[2].text = 'The chatbot allows you to search FIDIC contracts.';
                    welcomeCard1.body[3].text = 'Submit "start" or "help" anytime to start again and for help.';
                    welcomeCard1.body[4].text = 'After selecting a contract, General Conditions clauses are displayed by submitting a clause number or a keyword.';
                    welcomeCard1.body[5].text = 'Keywords search the index of clauses, or in the General Conditions when searching is activated (by submitting \"c1s\" or \"start\" -> \"c1 s\" for the Construction Contract).';
                    welcomeCard1.body[6].text = 'Shortcut codes for contracts that can be submitted at any time are "c1" for Construction Contract 1st Ed 1999 and "p1" for Plant & Design-Build Contract 1st Ed 1999 (in the process of being uploaded).';
                    welcomeCard1.body[7].text = '[FIDICchatbot](https://fidic.tips/chatbot) is complemented by [FIDICbot](https://fidic.tips/bot) that suppplies messenging channels (e.g., LINE and Viber) that are not served by FIDICchatbot. Both bots are developed by Bricad Associates, Switzerland, as part of the [FIDIC.tips](https://FIDIC.tips) initiative.';

                    await context.sendActivity({attachments: [CardFactory.adaptiveCard(welcomeCard1)]});
                               
                }
            }

            await next();
        });


        this.onDialog(async (context, next) => {

            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            await next();
        });
    }
        
}

module.exports.QnAMultiturnBot = QnAMultiturnBot;
