
let news = [];

//페이지네이션
let page = 1;
let total_pages = 0;


//querySelectorAll 버튼목록들 전부
let menus = document.querySelectorAll(".menus button");
console.log("menus",menus);
menus.forEach((menu) => menu.addEventListener("click", (event)=>getNewsByTopic(event)));

//키워드검색
let searchButton  = document.getElementById("search-button");
console.log("searchButton", searchButton);

let url;

//try ~ catch 
const getNews = async() => {
    
    try {
        let header = new Headers({"x-api-key" : "U5vDkw4JdgBc1gBLF2J2waR7-MiQJtARq1hvyzf0bYY"});  

        //url page라는 걸 쿼리에 추가
        url.searchParams.set("page", page); //&page=
        console.log("url은 어떻게 생겻는지", url);

        let response = await fetch(url, {headers:header});    
        console.log("this is response: ", response);
        let data = await response.json();
        console.log("this is data: ", data);
        let totalPage = data.total_pages;

        if(response.status == 200) {
            if(data.total_hits == 0) {
                throw new Error("검색된 결과값이 없습니다.");
            }
            news = data.articles; 
            console.log("this is news: ", news);

            total_pages = data.total_pages;
            page = data.page;

            render();
            pagenation();
        } else {
            throw new Error(data.message);
        }     

    } catch(error) {
        console.log("잡힌 에러는 ", error.message);
        errorRender(error.message);
    }
};


//api부르는 함수
const getLatestNews = async() => {
    //URL이라는 클래스를 이용해서 크롬에 보낸다.
   url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=kr&topic=music&page_size=10&`);
   console.log(url);

    getNews();
};



//뉴스종류 menus를 선택했을때
const getNewsByTopic = async (event)=>{
    console.log("클릭됨", event.target.textContent);
    
    let topic = event.target.textContent.toLowerCase();

    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=kr&topic=${topic}&page_size=10`);
    console.log("url", url);

    getNews(); 
};


//키워드 검색했을때
const getNewsByKeyword = async () => {
    console.log("click");
    let keyword = document.getElementById("search-input").value;
    console.log("keyword",keyword);
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
    
    getNews();
};

const render = () => {
         let newsHTML = ''
    
         //todoList에선 for문을 썻지만 여기선 Map을 쓸 거다.
         newsHTML = news.map(item=> {
            //news.media는 news의 콜솔 찍어보고 news안의 값들 중에 media에 img 파일이 들어가 있다.
             return `<div class="row news">
                         <div class="col-lg-4">
                             <img class="news-img-size" src="${item.media}">
                         </div>
                         <div class="col-lg-8">
                             <h2>${item.title}</h2>
                             <p>
                             ${item.summary}
                             </p>
                             <div>   
                             ${item.rights} * ${item.published_date}
                             </div>
                         </div>
                     </div>`;
                     
         }).join('');

         console.log(newsHTML);

         document.getElementById("news-board").innerHTML = newsHTML;
};

//getNews에서 에러가 잡혓을때 에러메세지를 화면에 뿌리기
const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
                       ${message}
                    </div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
};


//pagenation 페이지알고리즘
const pagenation = () => {

    let pagenationHTML = ``;

    let pageGroup = Math.ceil(page/5);

    let last = pageGroup*5;

    let first = last - 4;

    console.log("page", page);
    console.log("last", last);
    console.log("first", first);

    
    if(page == 1) {
        pagenationHTML = ``;
    } else {
        pagenationHTML = `<li class="page-item">
                            <a class="page-link" href="#" onclick="moveToPage(${page-1})" aria-label="Previous">
                                <span aria-hidden="false">&lt;</span>
                            </a>
                          </li>
                          <li>
                            <a class="page-link" href="#" onclick="moveToPage(${1})" aria-label="Previous">
                                <span aria-hidden="false">&laquo;</span>
                            </a>
                          </li>`;
    };

    // first ~ last 페이지 프린트
    for(let i=first; i <= last; i++) {

        pagenationHTML += `<li class="page-item ${page == i? "active" : ""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
    }


    if(page == total_pages) {
        pagenationHTML += ``;
    } else {
        pagenationHTML += `<li class="page-item">
                                <a class="page-link" href="#" onclick="moveToPage(${page + 1})" aria-label="Next">
                                    <span aria-hidden="true">&gt;</span>
                                </a>                
                            </li>
                            <li>
                                <a class="page-link" href="#" onclick="moveToPage(${total_pages})" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>`
    };

  

    document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
    //1. 이동하고싶은 페이지를 알아야겠지r
    page = pageNum
    console.log(page)

    //2. 이동하고싶은 페이지를 가지고 api를 다시 호출해줘야 겟지
    getNews();

};


searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
