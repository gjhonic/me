let projects = [
  {
    title: "Севанд",
    description: "Система ежедневного внутрифакультетского анализа неявок и достижений",
    tehn: "Php, Yii2, MySQL, Bootstrap.",
    url: "#"
  },
]

let links = [
  {
    title: "Вконтакте",
    url: "https://vk.com/gjhonic",
  },
  {
    title: "Instagram",
    url: "https://www.instagram.com/gjhonic/",
  },
  {
    title: "Gmail: gjh0nic@ya.ru",
    url: null,
  }
]


function showProjects(){
  display = document.getElementById("display-internal");
  htmlProjects = "";

  for(let i=0; i<projects.length; i++){
    htmlProjects += "<h2>"+(i+1)+") "+projects[i].title+"</h2>";
    htmlProjects += "<p>"+projects[i].description+"</p>";
    htmlProjects += "<p>Инстументы: "+projects[i].tehn+"</p>";
    htmlProjects += "<a href='"+projects[i].url+"' target='_blank'>Подробнее...</a>";
  }
  display.innerHTML = htmlProjects;
}

function showLinks(){
  display = document.getElementById("display-internal");
  htmlLinks = "";

  for(let i=0; i<links.length; i++){
    htmlLinks += "<h2>"+(i+1)+") "+links[i].title+"</h2>";
    if(links[i].url!=null){
      htmlLinks += "<a href='"+links[i].url+"' target='_blank'>Перейти...</a>";
    }
  }
  display.innerHTML = htmlLinks;
}
