# EatWisely - AI-Powered Recipe Generation Platform

> *"In the world of technology, the most valuable contributions often emerge from complex journeys and unexpected transitions."*

## 🌟 Project Overview

EatWisely is a comprehensive AI-powered recipe generation platform consisting of a React Native mobile application and a robust Node.js backend. This sophisticated system leverages cutting-edge artificial intelligence to create personalized recipes based on user preferences, dietary restrictions, and nutritional goals.

After extensive development and careful deliberation regarding the project's future, this codebase is now being shared with the open-source community to foster innovation in the culinary technology space.

## ✨ What Makes This Exceptional

This platform represents a significant investment in development time and technical expertise, showcasing:

- **Advanced AI Integration**: Sophisticated recipe generation using OpenAI's GPT models
- **Cross-Platform Excellence**: Native mobile experience on both iOS and Android
- **Enterprise-Grade Architecture**: Scalable serverless backend with AWS integration
- **Production-Ready**: Complete with payment processing, analytics, and user management

The decision to open-source this project reflects a commitment to technological advancement and community benefit, regardless of commercial complexities that sometimes arise in the software industry.

## 🏗 Architecture

### Mobile Application (`eatwisely-app/`)
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Authentication**: Clerk integration
- **State Management**: React Context API
- **Navigation**: Expo Router
- **Payments**: React Native IAP
- **Analytics**: Mixpanel & Sentry

### Backend API (`eatwisely-api/`)
- **Runtime**: Node.js with Express
- **Deployment**: AWS Serverless Framework
- **Database**: Amazon DynamoDB
- **AI Service**: OpenAI GPT integration
- **Authentication**: Clerk backend integration
- **Notifications**: AWS SNS

## 🚀 Key Features

- **AI Recipe Generation**: Personalized recipes based on dietary preferences
- **Nutritional Analysis**: Detailed macro and micronutrient breakdowns
- **User Profiles**: Comprehensive preference and allergy management
- **Credit System**: Managed usage with in-app purchase integration
- **Cross-Platform**: Native iOS and Android applications
- **Real-time Notifications**: Push notification system
- **Analytics Integration**: User behavior tracking and insights

## 🛠 Technical Stack

**Frontend Technologies:**
- React Native 0.74.5
- Expo SDK 51
- TypeScript
- React Navigation
- Material Design Components

**Backend Technologies:**
- Node.js & Express
- AWS Lambda & API Gateway
- DynamoDB
- Serverless Framework
- OpenAI API Integration

**DevOps & Tools:**
- EAS Build & Deploy
- Sentry Error Tracking
- ESLint & Prettier
- Husky Git Hooks

## 📦 Getting Started

### Mobile App Setup
```bash
cd eatwisely-app
pnpm install
pnpm start
```

### Backend API Setup
```bash
cd eatwisely-api
npm install
npm run dev
```

For detailed setup instructions, refer to the README files in each subdirectory.

## 🤝 Contributing

This project welcomes contributions from developers at all levels. The codebase represents a solid foundation for:

- **AI/ML Engineers**: Enhancing recipe generation algorithms
- **Mobile Developers**: Improving user experience and platform features
- **Backend Developers**: Scaling infrastructure and API performance
- **UI/UX Designers**: Refining the user interface and experience

## 💡 Project Philosophy

Technology should serve humanity's needs, and sometimes the greatest service comes from making sophisticated solutions freely available. This project embodies the principle that exceptional software should transcend individual commercial interests and contribute to collective advancement.

In times when global conflicts remind us of the importance of supporting democratic values and technological freedom, open-source contributions become even more meaningful. This project represents a commitment to sharing knowledge with those who share values of peace, technological ethics, and fair business practices.

The culinary technology space has immense potential for innovation, and by sharing this comprehensive platform, we hope to inspire and enable others to build upon this foundation.

## 📜 Licensing

This project is released under the MIT License, providing maximum freedom for use, modification, and distribution.

## 🔮 Future Vision

While this codebase represents a complete, production-ready system, the open-source community may find numerous opportunities for enhancement:

- Enhanced AI models for recipe generation
- Integration with additional nutritional databases
- Expanded dietary restriction support
- Community recipe sharing features
- Multi-language localization

---

*Built with passion for culinary innovation and shared with the global developer community*

**Note**: This project demonstrates enterprise-level development practices and may serve as an excellent reference for similar applications in the food-tech industry.
