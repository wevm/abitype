import { parseAbi } from "abitype";
import { seaportHumanReadableAbi } from "abitype/test";

import { readContract } from "../examples/readContract.js";

// open trace in https://ui.perfetto.dev
const result = readContract({
  address: "0x",
  abi: parseAbi(seaportHumanReadableAbi),
  functionName: "getOrderStatus",
  args: ["0x"],
});
result;
