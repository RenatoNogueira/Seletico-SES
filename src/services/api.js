import axios from "axios";

const api = axios.create({
  baseURL: "https://apl-qa-web-02.saude.ma.gov.br/seletivo-psg-qa/swagger/index.html", // coloque a base do seu Swagger aqui
});

export default api;