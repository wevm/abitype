import { bench } from "@arktype/attest";
import { type TypedDataToPrimitiveTypes } from "./utils.js";

bench("recursive", () => {
  const types3 = {
    Foo: [{ name: "bar", type: "Bar[]" }],
    Bar: [{ name: "foo", type: "Foo[]" }],
  } as const;
  return {} as TypedDataToPrimitiveTypes<typeof types3>;
}).types([12, "instantiations"]);

bench("deep", () => {
  const types = {
    Contributor: [
      { name: "name", type: "string" },
      { name: "address", type: "address" },
    ],
    Website: [
      { name: "domain", type: "string" },
      { name: "webmaster", type: "Contributor" },
    ],
    Project: [
      { name: "name", type: "string" },
      { name: "contributors", type: "Contributor[2]" },
      { name: "website", type: "Website" },
    ],
    Organization: [
      { name: "name", type: "string" },
      { name: "projects", type: "Project[]" },
      { name: "website", type: "Website" },
    ],
  } as const;
  return {} as TypedDataToPrimitiveTypes<typeof types>;
}).types([44, "instantiations"]);
