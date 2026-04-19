import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatIgnitionPlugin from "@nomicfoundation/hardhat-ignition";
import { defineConfig } from "hardhat/config";
import fs from "fs";
import path from "path";

// Read PRIVATE_KEY from .env without dotenv (avoids ERR_MODULE_NOT_FOUND)
const envPath = path.resolve(process.cwd(), ".env");
let myPrivateKey = "";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const keyMatch = envContent.match(/PRIVATE_KEY=["']?([^"'\r\n]+)["']?/);
  if (keyMatch) {
    myPrivateKey = keyMatch[1];
  }
}

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin, hardhatIgnitionPlugin],

  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },

  networks: {
    sepolia: {
      type: "http",
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: myPrivateKey ? [myPrivateKey] : [],
    },
  },
});