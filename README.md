# WisdomBridge

WisdomBridge is a platform for creating AI digital twins of historical figures, built on [GaiaNet’s decentralized nodes](https://www.gaianet.ai/). This innovative approach allows users to engage in cross-time conversations and discuss contemporary hot topics, enabling interactions with virtual representations of influential personalities from the past. Users can gain valuable insights and perspectives on current issues through these dynamic exchanges.

[WisdomBridge](https://wisdombridge.space/)

### Features

1. **Historical AI Digital Twins**: Converse with lifelike AI representations of historical figures, bringing their wisdom into modern discussions.
2. **Cross-Time Conversations**: Engage in unique dialogues that bridge the gap between past and present, enriching exchanges on various topics.
3. **Contemporary Relevance**:  Explore how historical insights can inform current events and societal challenges, fostering deeper understanding.
4. **Decentralization**: Leveraging GaiaNet’s distributed nodes, WisdomBridge ensures secure and resilient interactions, reducing the risk of data breaches.
5. **User-Friendly Interface**: A clean and intuitive design facilitates easy navigation, making it simple for users to initiate and participate in conversations.

### Future Enhancements

1. **AI Agents**: Introduce personalized AI agents that adapt to user preferences, enhancing the conversation experience.
2. **Retrieval-Augmented Generation (RAG)**: Implement RAG technology to provide accurate, contextually relevant information during discussions.
3. **User-Submitted Data for AI Optimization**: Enable users to contribute data that can refine AI models, ensuring continuous improvement in interaction quality.



### Project Structure

**Frontend**: Built with React, providing the user interface for interacting with the WisdomBridge.

**Backend**: Developed using Golang, handling AI processing and communication with GaiaNet.

### Installation

#### Prerequisites

- Node.js: 18.20.4
- Go: 1.23

#### Steps

1. Clone the repository:

```bash
git clone https://github.com/smallfu6/wisdombridge.git
```

2. Navigate to the project directory:

```bash
cd wisdombridge
```

3. Install frontend dependencies:

```bash
npm install
```

4. Install backend dependencies:

```bash
cd gochat
go mod tidy
```

5. Start the backend server:

```bash
go run main.go
```

6. Start the frontend application in a new terminal:

```bash
cd wisdombridge
npm start
```

Open your browser and navigate to http://localhost:3000 to chat with WisdomBridge.

### Contributing
We welcome contributions! Please read the Contributing Guidelines for more information.

