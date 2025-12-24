// topic-nav.js - 处理知识点页面之间的导航链接
async function initTopicNavigation(currentPagePath) {
  try {
    // 获取学习路径数据
    const response = await fetch("../../data/learning-path.json");
    const learningPath = await response.json();
    
    // 将所有项目扁平化为一个数组
    const allItems = [];
    learningPath.sections.forEach(section => {
      section.items.forEach(item => {
        allItems.push({
          id: item.id,
          title: item.title,
          link: item.link,
          sectionTitle: section.title
        });
      });
    });
    
    // 查找当前页面在数组中的位置
    const currentIndex = allItems.findIndex(item => 
      item.link && item.link.replace('./', '').replace('.html', '') === 
      currentPagePath.replace('../../', '').replace('.html', '')
    );
    
    if (currentIndex === -1) {
      console.warn('无法在学习路径中找到当前页面');
      return;
    }
    
    // 获取上一节和下一节
    const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
    const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;
    
    // 更新导航按钮
    updateNavigationButtons(prevItem, nextItem);
  } catch (error) {
    console.error('初始化知识点导航失败:', error);
  }
}

function updateNavigationButtons(prevItem, nextItem) {
  const navContainer = document.querySelector('.nav-buttons');
  if (!navContainer) return;
  
  // 清空现有内容
  navContainer.innerHTML = '';
  
  // 创建返回学习路径按钮
  const backToPathButton = document.createElement('button');
  backToPathButton.className = 'toggle-btn';
  backToPathButton.textContent = '← 返回学习路径';
  backToPathButton.onclick = () => {
    window.location.href = '../../learning-path.html';
  };
  
  // 创建上一节按钮（如果存在）
  let prevButton = null;
  if (prevItem) {
    prevButton = document.createElement('button');
    prevButton.className = 'toggle-btn';
    prevButton.innerHTML = `← 上一节：${prevItem.title}`;
    prevButton.onclick = () => {
      window.location.href = prevItem.link;
    };
  }
  
  // 创建下一节按钮（如果存在）
  let nextButton = null;
  if (nextItem) {
    nextButton = document.createElement('button');
    nextButton.className = 'toggle-btn';
    nextButton.innerHTML = `下一节：${nextItem.title} →`;
    nextButton.onclick = () => {
      window.location.href = nextItem.link;
    };
  }
  
  // 添加按钮到容器
  navContainer.appendChild(backToPathButton);
  
  if (prevButton) {
    // 在小屏幕上将上一节按钮放到单独的一行
    if (window.innerWidth <= 768) {
      const prevContainer = document.createElement('div');
      prevContainer.style.width = '100%';
      prevContainer.appendChild(prevButton);
      navContainer.appendChild(prevContainer);
    } else {
      navContainer.appendChild(prevButton);
    }
  }
  
  if (nextButton) {
    // 在小屏幕上将下一节按钮放到单独的一行
    if (window.innerWidth <= 768) {
      const nextContainer = document.createElement('div');
      nextContainer.style.width = '100%';
      nextContainer.appendChild(nextButton);
      navContainer.appendChild(nextContainer);
    } else {
      navContainer.appendChild(nextButton);
    }
  }
  
  // 添加响应式处理
  window.addEventListener('resize', () => {
    // 重新处理按钮布局
    updateNavigationButtons(
      prevButton ? { title: prevButton.textContent.replace('← 上一节：', ''), link: prevButton.onclick } : null,
      nextButton ? { title: nextButton.textContent.replace('下一节：', '').replace(' →', ''), link: nextButton.onclick } : null
    );
  });
}