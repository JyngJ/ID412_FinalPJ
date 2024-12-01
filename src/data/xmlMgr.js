import fs from "fs";
import { parseString, Builder } from "xml2js";

const xmlFilePath = "./data/currentdata.xml"; // 저장할 XML 파일 경로

// XML 파일 초기화 및 새 데이터 저장
export async function saveToXml(query, searchResults, mode = "initialize") {
  const builder = new Builder();
  let xmlContent = null;
  let existingData = { search: { results: [] } };

  if (mode === "append" && fs.existsSync(xmlFilePath)) {
    // 기존 XML 파일 읽기
    xmlContent = fs.readFileSync(xmlFilePath, "utf-8");

    // 기존 XML 데이터를 파싱
    parseString(xmlContent, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
      } else {
        existingData = result || { search: { results: [] } };
      }
    });
  }

  if (mode === "initialize") {
    // 초기화: 기존 데이터 제거하고 새 데이터 저장
    existingData = {
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
  } else if (mode === "append") {
    // 추가: 기존 데이터 유지하고 새 데이터 추가
    const newResults = searchResults.map((item) => ({
      title: item.title,
      snippet: item.snippet,
      image: item.image || "",
    }));
    existingData.search.results.push(...newResults);
  }

  // 업데이트된 데이터를 XML로 변환 후 저장
  const updatedXml = builder.buildObject(existingData);
  fs.writeFileSync(xmlFilePath, updatedXml, "utf-8");

  console.log(
    mode === "initialize"
      ? "XML initialized with new data."
      : "Data appended to XML.",
    xmlFilePath
  );
}
