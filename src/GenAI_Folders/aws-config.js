import { PollyClient } from "@aws-sdk/client-polly";

const awsConfig = {
    region: import.meta.env.VITE_AWS_REGION || "ap-south-1",
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
};

export const polly = new PollyClient(awsConfig);

