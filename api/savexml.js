import fs from "fs";
import path from "path";
import { Builder } from "xml2js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const builder = new Builder();
    const xmlContent = builder.buildObject(req.body);
    const filePath = path.join(process.cwd(), "public", "currentdata.xml");

    fs.writeFileSync(filePath, xmlContent, "utf-8");

    res.status(200).json({ message: "XML saved successfully" });
  } catch (error) {
    console.error("Error saving XML:", error);
    res.status(500).json({ message: "Error saving XML file" });
  }
}
