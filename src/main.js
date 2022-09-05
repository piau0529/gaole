const FormAutoFill = new Vue({
  el: '#app',
  data: {

    // Google Apps Script 部署為網路應用程式後的 URL
    gas: 'https://script.google.com/macros/s/AKfycbywcGT9NBssKaBqS5uLH0487IV_thmViXNz2puqDT-N7-R5w-LJuo3zVqYKUbA2H1ph/exec',

    id: '',

    // 避免重複 POST，存資料用的
    persons: {},

    // 頁面上吐資料的 data
    person: {},

    // Google Form 的 action URL
    formAction: 'https://docs.google.com/forms/u/2/d/e/1FAIpQLScqs1amEuSipFEO036Rdv7hdYr18wvuOi9unYXOYv3XqUjanA/formResponse',
    
    // Google Form 各個 input 的 name
    input: {
      id: 'entry.2111259551',
      email: 'entry.1788398348',
      nick: 'entry.34866250',
      msg1: 'entry.211211733',
      msg2: 'entry.71595443',
      msg3: 'entry.986226888',
      msg4: 'entry.787660417'
    },

    // loading 效果要不要顯示
    loading: false
  },
  methods: {
    // ID 限填 4 碼
    limitIdLen(val) {
      if(val.length > 11) {
        return this.id =  this.id.slice(0, 10);
      }
    },
    // 送出表單
    submit() {
      // 再一次判斷是不是可以送出資料
      if(this.person.nick !== undefined) {
        let params = `${this.input.id}=${this.person.id}&${this.input.email}=${this.person.email}&${this.input.nick}=${this.person.nick}&${this.input.msg1}=${this.person.msg1}&${this.input.msg2}=${this.person.msg2}&${this.input.msg3}=${this.person.msg3&${this.input.msg4}=${this.person.msg4 || '無'}`;
        fetch(this.formAction + '?' + params, {
          method: 'POST'
        }).catch(err => {
            alert('提交成功。');
            this.id = '';
            this.person = {};
          })
      }
    }
  },
  watch: {
    id: function(val) {
      // ID 輸入到 11 碼就查詢資料
      if(val.length === 11) {

        // this.persons 裡沒這筆資料，才 POST
        if(this.persons[this.id] === undefined) {
          this.loading = true;
          let uri = this.gas + '?id=' + this.id;
          fetch(uri, {
            method: 'POST'
          }).then(res => res.json())
            .then(res => {
              this.persons[this.id] = res; // 把這次查詢的 id 結果存下來
              this.person = res;
              this.loading = false;
            })
        }
        // this.persons 裡有資料就吐資料
        else {
          this.person = this.persons[this.id];
        }

      }
    }
  }
})
