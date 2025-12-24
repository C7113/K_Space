﻿﻿﻿// learning-path.js - 从 data/learning-path.json 加载并渲染学习路径
async function loadLearningPath() {
  try {
    const res = await fetch("./data/learning-path.json");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    renderLearningPath(data);
    return data;
  } catch (err) {
    console.error("加载学习路径数据失败", err);
    document.getElementById("content").innerHTML = `
      <div class="topic-card error">
        <h3> 加载失败</h3>
        <p>无法加载学习路径数据，请检查以下几点：</p>
        <ul>
          <li>data/learning-path.json 文件是否存在</li>
          <li>文件内容是否为有效的 JSON 格式</li>
          <li>是否通过 HTTP 服务器访问（而不是直接打开文件）</li>
        </ul>
        <p>错误信息: ${err.message}</p>
      </div>
    `;
  }
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    document.querySelectorAll(".level-section").forEach((section) => {
      let hasMatch = false;
      const sectionTitle = section.querySelector(".level-title")?.textContent.toLowerCase() || "";
      const sectionDesc = section.querySelector(".details")?.textContent.toLowerCase() || "";
      
      const cards = section.querySelectorAll(".topic-card-wrapper");
      cards.forEach((card) => {
        const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
        const desc = card.querySelector("p")?.textContent.toLowerCase() || "";
        const tags = Array.from(card.querySelectorAll(".tag") || [])
          .map((tag) => tag.textContent.toLowerCase());
        
        const matches = !searchTerm || 
                       title.includes(searchTerm) || 
                       desc.includes(searchTerm) ||
                       tags.some((tag) => tag.includes(searchTerm));
        
        card.style.display = matches ? "" : "none";
        if (matches) hasMatch = true;
      });
      
      if (sectionTitle.includes(searchTerm) || sectionDesc.includes(searchTerm)) {
        hasMatch = true;
        cards.forEach((card) => card.style.display = "");
      }
      
      section.style.display = hasMatch ? "" : "none";
    });
  });
}

function createItemCard(item) {
  const wrapper = document.createElement("a");
  wrapper.className = "topic-card-wrapper";
  wrapper.href = item.link || "#";
  if (item.link === "#") {
    wrapper.addEventListener("click", (e) => {
      e.preventDefault();
      alert("此知识点的内容正在编写中，敬请期待！");
    });
  }
  
  const el = document.createElement("div");
  el.className = "topic-card interactive";
  
  const titleDiv = document.createElement("div");
  titleDiv.className = "title-wrapper";
  
  const title = document.createElement("h3");
  title.textContent = item.title;
  titleDiv.appendChild(title);
  
  if (item.tags && item.tags.length > 0) {
    const tagsDiv = document.createElement("div");
    tagsDiv.className = "tags";
    item.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      tagsDiv.appendChild(span);
    });
    titleDiv.appendChild(tagsDiv);
  }
  
  el.appendChild(titleDiv);

  const p = document.createElement("p");
  p.textContent = item.desc || "";
  p.style.lineHeight = "1.6";
  p.style.marginBottom = "1.25rem";
  p.style.flex = "1";
  el.appendChild(p);

  const status = document.createElement("div");
  status.className = "card-status";
  if (item.link && item.link !== "#") {
    status.innerHTML = "<span class=\"status-text\">点击学习 </span>";
  } else {
    status.innerHTML = "<span class=\"status-text pending\">即将推出</span>";
  }
  el.appendChild(status);
  
  wrapper.appendChild(el);
  return wrapper;
}

function renderLearningPath(data) {
  const content = document.getElementById("content");
  content.innerHTML = "";

  const meta = document.createElement("div");
  meta.style.marginBottom = "1rem";
  meta.innerHTML = `<strong>${data.meta.title}</strong> &nbsp; <small>版本: ${data.meta.version} 更新: ${data.meta.updated}</small>`;
  content.appendChild(meta);

  data.sections.forEach((section) => {
    const sec = document.createElement("section");
    sec.className = "level-section";
    sec.id = section.id;

    const h2 = document.createElement("h2");
    h2.className = "level-title";
    h2.textContent = section.title;
    sec.appendChild(h2);

    if (section.description) {
      const desc = document.createElement("p");
      desc.className = "details";
      desc.style.display = "block";
      desc.textContent = section.description;
      desc.style.background = "linear-gradient(to right, var(--section-bg), transparent)";
      desc.style.padding = "1.2rem";
      desc.style.borderRadius = "12px";
      desc.style.borderLeft = "4px solid var(--accent)";
      desc.style.fontSize = "0.95rem";
      desc.style.lineHeight = "1.6";
      desc.style.margin = "1rem 0";
      sec.appendChild(desc);
    }

    const grid = document.createElement("div");
    grid.className = "topic-grid";

    section.items.forEach((item) => {
      const card = createItemCard(item);
      grid.appendChild(card);
    });

    sec.appendChild(grid);
    content.appendChild(sec);
  });

  const toc = document.getElementById("toc-list");
  toc.innerHTML = "";
  data.sections.forEach((section) => {
    const a = document.createElement("a");
    a.href = `#${section.id}`;
    a.textContent = section.title;
    a.style.display = "block";
    a.style.marginBottom = "0.4rem";
    a.style.padding = "0.25rem 0.5rem";
    a.style.borderRadius = "4px";
    a.style.transition = "all var(--transition)";
    a.addEventListener("mouseenter", function() {
      this.style.background = "var(--section-bg)";
    });
    a.addEventListener("mouseleave", function() {
      this.style.background = "";
    });
    toc.appendChild(a);
  });
}

async function init() {
  const data = await loadLearningPath();
  if (data) {
    setupSearch();
  }
}

init();