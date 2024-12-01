import fs from "fs";
import path from "path";

export default async (req, res) => {
  const filePath = path.resolve("./public/currentdata.xml");

  if (fs.existsSync(filePath)) {
    const xmlContent = fs.readFileSync(filePath, "utf-8");
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xmlContent);
  } else {
    res.status(404).json({ message: "XML file not found" });
  }
};
