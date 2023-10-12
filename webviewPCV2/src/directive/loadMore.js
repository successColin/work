import Vue from 'vue';

Vue.directive('loadMore', {
  bind(el, binding) {
    const classList = el.getAttribute('class');
    const selectWrap = classList.indexOf('el-table') > -1 ? el.querySelector('.el-table__body-wrapper') : el;
    selectWrap.addEventListener('scroll', function () {
      const sign = 0;
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
      if (scrollDistance <= sign) {
        binding.value();
      }
    });
  }
});
