import axios from "axios";

export async function fetchSearchData(query, apiKey, cx, start = 1) {
  const url = "https://www.googleapis.com/customsearch/v1";

  try {
    const response = await axios.get(url, {
      params: {
        q: query,
        key: apiKey,
        cx: cx,
        start: start,
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items.map((item) => ({
        title: item.title,
        snippet: item.snippet,
        image: item.pagemap?.cse_image?.[0]?.src || null, // 이미지가 있는 경우
      }));
    } else {
      console.warn("No search results found.");
      return [];
    }
  } catch (error) {
    console.error(
      "Error in fetchSearchData:",
      error.response?.data || error.message
    );
    throw error; // 에러를 호출한 함수로 전달
  }
}
