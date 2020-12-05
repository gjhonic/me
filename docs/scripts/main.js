//Вспомогательные функции  --->
//Возвращает текущую дату
function NowDate() {
  let now = new Date()
  return now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
}
//Записывает лог
function addLog(title) {
    let logs = document.getElementById("display-logs");
    logs.innerHTML += "["+NowDate()+"]🢒"+title+"<br>";
}
//Начальная инициализация
function init(){
  let version = document.getElementById("display-version");
  version.innerHTML = "Gjhonic v"+System_Data.version;
}
//Изменение времени на сайте
function updateClock() {
    var now = new Date(), // current date
        time = now.getHours() + ':' + now.getMinutes(), // again, you get the idea
        date = [now.getDate(),
                now.getMonth(),
                now.getFullYear()].join(':');
    document.getElementById('time').innerHTML = [date, time].join(' / ');

    setTimeout(updateClock, 1000);
}
// <---

//Показывет проекты
function showProjects(){
  let display = document.getElementById("display-internal");
  let htmlProjects = "";

  for(let i=0; i<projects.length; i++){
    htmlProjects += "<h2>"+(i+1)+") "+projects[i].title+"</h2>";
    htmlProjects += "<p>"+projects[i].description+"</p>";
    htmlProjects += "<p>Инстументы: "+projects[i].tehn+"</p>";
    htmlProjects += "<a href='"+projects[i].url+"' target='_blank'>Подробнее...</a>";
  }
  display.innerHTML = htmlProjects;
  addLog("Open projects");
}
//Показывет ссылки
function showLinks(){
  let display = document.getElementById("display-internal");
  let htmlLinks = "";

  for(let i=0; i<links.length; i++){
    htmlLinks += "<h2>"+(i+1)+") "+links[i].title+"</h2>";
    if(links[i].url!=null){
      htmlLinks += "<a href='"+links[i].url+"' target='_blank'>Перейти...</a>";
    }
  }
  addLog("Open links");
  display.innerHTML = htmlLinks;
}
//Показывает учебные проекты
function showStudyProjects(){
  let display = document.getElementById("display-internal");
  let htmlProjects = "";

  for(let i=0; i<study_projects.length; i++){
    htmlProjects += "<h2>"+(i+1)+") "+study_projects[i].title+"</h2>";
    htmlProjects += "<p>"+study_projects[i].description+"</p>";
    htmlProjects += "<p>Инстументы: "+study_projects[i].tehn+"</p>";
    htmlProjects += "<a href='"+study_projects[i].url+"' target='_blank'>Подробнее...</a>";
  }
  display.innerHTML = htmlProjects;
  addLog("Open study project");
}



init();
updateClock(); // initial call
