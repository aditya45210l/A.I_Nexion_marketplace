"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {base} from "viem/chains";

const config = getDefaultConfig({
  appName: "Simle ENS",
  projectId: 'be7bdc5bddc672a5f0003bb02559f68e',
  chains: [base],
  ssr: false,
});

export default config;