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
  var now = new Date(); // current date
  var mont = (parseInt(now.getMonth())+1);
  mont.toString()
  time = now.getHours() + ':' + now.getMinutes(), // again, you get the idea
  date = [now.getDate(),
            mont,
            now.getFullYear()].join(':');
  document.getElementById('time').innerHTML = [date, time].join(' / ');

  setTimeout(updateClock, 1000);
}
// <---

//Показывет проекты
function showProjects(){
  let display = document.getElementById("display-internal");
  let htmlProjects = "<h3 class='title-internal'>gjhonic-pc:\\ Мои проекты</h3>";

  for(let i=0; i<projects.length; i++){
    htmlProjects += "<div class='list-internal'>";
    htmlProjects += "<h4>"+(i+1)+") "+projects[i].title+"</h4>";
    htmlProjects += "<p>"+projects[i].description+"</p>";
    htmlProjects += "<p><i>Инстументы: "+projects[i].tehn+"</i></p>";
    htmlProjects += "<a href='"+projects[i].url+"' target='_blank'>Подробнее...</a><br>";
    htmlProjects += "</div>";
  }
  display.innerHTML = htmlProjects;
  addLog("Open projects");
}
//Показывет ссылки
function showLinks(){
  let display = document.getElementById("display-internal");
  let htmlLinks = "<h3 class='title-internal'>gjhonic-pc:\\ Мои ссылки</h3>";

  for(let i=0; i<links.length; i++){
    htmlLinks += "<div class='list-internal'>";
    htmlLinks += "<h4>"+(i+1)+") "+links[i].title+"</h4>";
    if(links[i].url!=null){
      htmlLinks += "<a href='"+links[i].url+"' target='_blank'>Перейти...</a><br>";
    }
    htmlLinks += "</div>";
  }
  addLog("Open links");
  display.innerHTML = htmlLinks;
}
//Показывает учебные проекты
function showStudyProjects(){
  let display = document.getElementById("display-internal");
  let htmlProjects = "<h3 class='title-internal'>gjhonic-pc:\\ Мои учебные проекты</h3>";

  for(let i=0; i<study_projects.length; i++){

    htmlProjects += "<div class='list-internal'>";
    htmlProjects += "<h4>"+(i+1)+") "+study_projects[i].title+"</h4>";
    htmlProjects += "<p>"+study_projects[i].description+"</p>";
    htmlProjects += "<p><i>Инстументы: "+study_projects[i].tehn+"</i></p>";
    htmlProjects += "<p><i>Ver: "+study_projects[i].v+"</i></p>";
    htmlProjects += "<a href='"+study_projects[i].url+"' target='_blank'>Подробнее...</a>";
    htmlProjects += "</div>";
  }
  display.innerHTML = htmlProjects;
  addLog("Open study project");
}
//Показывает достижения
function showAchiev(){
  let display = document.getElementById("display-internal");
  let htmlAchievs = "<h3 class='title-internal'>gjhonic-pc:\\ Мои Достижения</h3>";

  for(let i=0; i<achives.length; i++){

    htmlAchievs += "<div class='list-internal'>";
    htmlAchievs += "<h4>"+(i+1)+") "+achives[i].title+"</h4>";
    htmlAchievs += "<img src='"+achives[i].src+"' heifht='"+achives[i].h+"' width='"+achives[i].w+"'>";
    htmlAchievs += "<p>"+achives[i].description+"</p>";
    htmlAchievs += "</div>";
  }
  display.innerHTML = htmlAchievs;
  addLog("Open achievs");
}



init();
updateClock(); // initial call
