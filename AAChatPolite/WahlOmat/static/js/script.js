
document.addEventListener('DOMContentLoaded', () => {
    const tags = document.querySelectorAll('.tag'); // Select elements with class "tag"
  
    tags.forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('tagselected');
      });
    });

    const tags2 = document.querySelectorAll('.tagselected'); // Select elements with class "tag"
  
    tags2.forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('tag');
      });
    });

  
  
});