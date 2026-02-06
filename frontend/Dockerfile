FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# axios ပါတာ သေချာအောင် ဒီမှာ တစ်ခါတည်း ထည့်သွင်းခိုင်းမယ်
RUN npm install && npm install axios
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
