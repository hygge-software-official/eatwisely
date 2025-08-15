import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import * as Sentry from '@sentry/node';

export const snsClient = new SNSClient({ region: 'us-east-1' });

/**
 * Send a message to the user via SNS.
 * @param {string} endpointArn - ARN of the endpoint for a specific user.
 * @param {number} connects - Number of connects.
 */
export const sendSNSMessage = async (endpointArn, connects, creditsAdded) => {

    try {
        const message = createMessage(connects, creditsAdded);
        const params = createSNSParams(endpointArn, message);
        await publishMessage(params);
    } catch (error) {
        console.error('Error publishing message to SNS:', error);
        Sentry.captureException(error);
    }
};

const createMessage = (connects, creditsAdded) => {
    const recipeWord = connects === 1 ? 'recipe' : 'recipes';
    const title = 'Recipes Updated';
    const body = `You now have ${connects} ${recipeWord}.`;
    const creditsAddedString = String(creditsAdded);

    return {
        default: `You have been assigned ${connects} ${recipeWord}.`,
        GCM: JSON.stringify({
            notification: { title, body, contentAvailable: connects },
            data: { connects, creditsAdded: creditsAddedString },
        }),
        APNs: JSON.stringify({
            aps: {
                alert: { title, body },
                contentAvailable: 1,
                mutableContent: 1,
            },
            connects,
            creditsAdded: creditsAddedString,
        }),
    };
};

const createSNSParams = (endpointArn, message) => ({
    Message: JSON.stringify(message),
    TargetArn: endpointArn,
    MessageStructure: 'json',
});

const publishMessage = async (params) => {
    try {
        const command = new PublishCommand(params);
        const response = await snsClient.send(command);
        console.log('Message published to SNS:', response.MessageId);
    } catch (error) {
        console.error('Failed to publish message to SNS:', error);
        Sentry.captureException(error);
        throw error;
    }
};