import { fetchSearchData } from "../services/googleSearchApi.js"; // 경로 수정

// 검색 데이터를 가져오고 정리하는 함수
export async function getData(query, page = 1) {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const cx = import.meta.env.VITE_GOOGLE_CX;

  const start = (page - 1) * 10 + 1;

  try {
    console.log(
      `Fetching data for query: "${query}", page: ${page}, start: ${start}`
    );
    const rawData = await fetchSearchData(query, apiKey, cx, start);
    console.log("Raw data from API:", rawData);

    const formattedData = rawData.map((item) => ({
      title: item.title || "No Title Available",
      image: item.image || null,
      snippet: item.snippet || "No Snippet Available",
    }));

    console.log(`Formatted Data (Page ${page}):`, formattedData);
    return formattedData;
  } catch (error) {
    console.error(
      "Error fetching and formatting data:",
      error.message || error
    );
    return [];
  }
}
