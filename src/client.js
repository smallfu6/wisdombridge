import { createThirdwebClient } from "thirdweb";

// 读取环境变量中的 clientId
const clientId = process.env.REACT_APP_THIRDWEB_CLIENT_ID;

// 使用 clientId 创建 thirdweb client
const client = createThirdwebClient({
  clientId: clientId, 
});

export default client;