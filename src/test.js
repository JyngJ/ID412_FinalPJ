import { getData } from "./data/fetchData.js"; // 검색 데이터 가져오기
import { saveToXml } from "./data/xmlMgr.js"; // XML 관리 함수 가져오기

let currentQuery = ""; // 현재 검색어
let currentPage = 1; // 현재 페이지

// 검색 및 결과 표시 함수
async function searchAndDisplay() {
  const searchQuery = document.getElementById("search-input").value.trim(); // 입력된 검색어
  const dataContainer = document.getElementById("data-container"); // 결과 표시용 DOM 요소

  if (!searchQuery) {
    dataContainer.innerHTML = "<p>Please enter a search query.</p>";
    return;
  }

  // 새로운 검색어 입력 시 페이지 초기화
  currentQuery = searchQuery;
  currentPage = 1;

  dataContainer.innerHTML = "<p>Loading results...</p>"; // 로딩 메시지

  try {
    const formattedData = await getData(searchQuery, currentPage); // 첫 페이지 데이터 가져오기

    if (formattedData.length === 0) {
      dataContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    // 화면 초기화 후 결과 표시
    dataContainer.innerHTML = formattedData
      .map(
        (item, index) => `
          <div class="result-item">
            <h3>${(currentPage - 1) * 10 + index + 1}. ${item.title}</h3>
            ${item.image ? `<img src="${item.image}" alt="Image" />` : ""}
            <p>${item.snippet}</p>
          </div>
        `
      )
      .join("");

    // XML 파일 초기화 및 저장
    await saveToXml(currentQuery, formattedData, "initialize");

    console.log(`Page ${currentPage} results displayed.`);
  } catch (error) {
    dataContainer.innerHTML =
      "<p>Error fetching data. Check console for details.</p>";
    console.error(error);
  }
}

// 다음 페이지 결과 표시 함수
async function nextAndDisplay() {
  const dataContainer = document.getElementById("data-container");

  if (!currentQuery) {
    dataContainer.innerHTML = "<p>Please perform a search first.</p>";
    return;
  }

  currentPage++; // 페이지 증가

  dataContainer.innerHTML += "<p>Loading more results...</p>"; // 추가 로딩 메시지

  try {
    const formattedData = await getData(currentQuery, currentPage); // 다음 페이지 데이터 가져오기

    if (formattedData.length === 0) {
      dataContainer.innerHTML += "<p>No more results found.</p>";
      return;
    }

    // 결과 추가 표시
    const currentResults = formattedData
      .map(
        (item, index) => `
          <div class="result-item">
            <h3>${(currentPage - 1) * 10 + index + 1}. ${item.title}</h3>
            ${item.image ? `<img src="${item.image}" alt="Image" />` : ""}
            <p>${item.snippet}</p>
          </div>
        `
      )
      .join("");

    dataContainer.innerHTML += currentResults;

    // XML 파일에 데이터 추가 저장
    await saveToXml(currentQuery, formattedData, "append");

    console.log(`Page ${currentPage} results appended.`);
  } catch (error) {
    dataContainer.innerHTML +=
      "<p>Error fetching more data. Check console for details.</p>";
    console.error(error);
  }
}

// DOMContentLoaded 이벤트에 맞춰 검색 및 다음 버튼 이벤트 리스너 등록
document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const nextButton = document.getElementById("next-button");

  searchButton.addEventListener("click", searchAndDisplay); // 검색 버튼 클릭 이벤트
  nextButton.addEventListener("click", nextAndDisplay); // 다음 버튼 클릭 이벤트
});
