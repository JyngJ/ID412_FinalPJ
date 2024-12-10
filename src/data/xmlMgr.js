import fs from "fs";
import { parseString, Builder } from "xml2js";

const xmlFilePath = "./data/currentdata.xml"; // 저장할 XML 파일 경로

// XML 파일 초기화 및 새 데이터 저장
export async function saveToXml(query, searchResults, mode = "initialize") {
  try {
    const data = {
      search: {
        query: query,
        timestamp: new Date().toISOString(),
        results: searchResults.map((item) => ({
          title: item.title,
          snippet: item.snippet,
          image: item.image || "",
        })),
      },
    };

    // API 경로 수정
    const response = await fetch("/api/savexml", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to save XML data: ${response.statusText}`);
    }

    console.log(
      mode === "initialize"
        ? "XML initialized with new data."
        : "Data appended to XML."
    );
  } catch (error) {
    console.error("Error saving XML:", error);
    throw error;
  }
}
