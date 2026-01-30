FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5003

ENV PORT=8080 \
    MONGO_URI="mongodb+srv://hemantqurilo:hemant123@cluster0.ovwtcc8.mongodb.net/ifbb?retryWrites=true&w=majority&appName=Cluster0" \
    USER_SECRET="usersecrettoken" \
    ADMIN_SECRET="adminsecrettoken" \
    CLOUDINARY_CLOUD_NAME="dx6wedayj" \
    CLOUDINARY_API_KEY="772838497978884" \
    CLOUDINARY_API_SECRET="XwX9PAlupWquE_A54APjQK-cvIM" \
    STRIPE_PUBLISHABLE_KEY="pk_test_51Rd2LlPxVJiXwFkWbgz8RIvqpG1cyxlIEUprkPfcK94wwbLXQqsLGPtQhjmA9mKUGKqLZsWMgp6oGJlPDEIcJJZv00UDmhSjnL" \
    STRIPE_SECRET_KEY="sk_test_51Rd2LlPxVJiXwFkWUolOEg9S8FkmF8yMLTAobxajXTb1UPt2z0jl08OxtZq1Zvr6O2H9zqdw7zAlLbWCk2vLpDf800s3bmU6Pc" \
    NODE_ENV=production

CMD ["npm", "start"]
