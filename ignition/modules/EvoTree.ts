import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EvoTreeModule", (m) => {
  const evoTree = m.contract("EvoTreeEcosystem");
  return { evoTree };
});