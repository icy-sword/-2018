  const postfixList = ['163.com', 'gmail.com', '126.com', 'qq.com', '263.net'];
  const sugWrapper = document.querySelector('#email-sug-wrapper');
  const input = document.querySelector('#email-input');

  //打开窗口时聚焦输入框
  var sug_idx = 0;
  window.onload = function() {
      input.focus();
  }

  function CheckAll() {
      for (i = 0; i < input.length; i++) { input[i].checked = true; };
  };
  //按键功能实现
  input.onkeypress = function(event) {
      if (event.keyCode === 32) { //禁止输入空格

          event.returnValue = false;
          console.log("no space!!!");

      }
  }
  input.onkeyup = function(event) {
      var key_code = event.keyCode;
      mk_sug();
      controlStaus();
      if (key_code === 27) { //ESC键取消并选中文本框内容
          hideSugs();
          input.select();
      }

      if (sugWrapper.children.length > 0) {
          for (var i = 0, len = sugWrapper.children.length; i < len; i++) {
              sugWrapper.children[i].className = "";
          };
          if (key_code === 38) { //上移键
              if (sug_idx === 0) {
                  sug_idx = sugWrapper.children.length - 1;
              } else {
                  sug_idx -= 1;
              }
          } else if (key_code === 40) { //下移键
              if (sug_idx === sugWrapper.children.length - 1) {
                  sug_idx = 0;
              } else {
                  sug_idx += 1;
              }
          } else if (key_code === 13) { //回车键确定
              input.value = HtmlUtil.htmlDecode(sugWrapper.children[sug_idx].innerHTML);
              sug_idx = 0;
              hideSugs();
          }
          sugWrapper.children[sug_idx].className = "selected";
      }
  }

  //获取用户输入
  function get_val() {
      return HtmlUtil.htmlEncode(input.value.trim());
  }

  //生成提示框中的提示内容
  function sug_content() {
      var input_vals = get_val(),
          sug_vals = [],
          idx = input_vals.indexOf("@"); //@出现的位数
      if (idx > -1) { //如果用户输入含有@
          var input_postfix = input_vals.slice(idx + 1); //@后面的内容
          input_vals = input_vals.slice(0, idx); //@前面的内容
      }
      input_vals += "@";
      //把用来拼接的用户输入内容和每一个postfix进行结合成为每一个Li
      for (var i = 0, len = postfixList.length; i < len; i++) {
          if (idx > -1) {
              if (postfixList[i].indexOf(input_postfix) > -1) {
                  sug_vals.push(input_vals + postfixList[i]);
              }
          } else {
              sug_vals.push(input_vals + postfixList[i]);
          }
      }
      return sug_vals;
  }

  //function将提示内容添加到email-sug-wrapper中
  function mk_sug() {
      var sug_vals = sug_content(); //获取生成提示框中的提示内容
      sugWrapper.innerHTML = "";
      for (var i = 0, len = sug_vals.length; i < len; i++) { //将内容添加到email-sug-wrapper中
          var oLi = document.createElement("li");
          oLi.innerHTML = sug_vals[i];
          sugWrapper.appendChild(oLi);
      }
  }

  //控制email-sug-wrapper的显示/隐藏状态
  function controlStaus() {
      if (get_val() === "") {
          hideSugs();
      } else {
          showSugs();
      }
  }

  function hideSugs() {
      sugWrapper.style.display = 'none';
  }

  function showSugs() {
      sugWrapper.style.display = 'block';
  }

  //选取DOM节点监听鼠标点击
  sugWrapper.onclick = function(event) {
      var tar = event.target;
      if (tar.parentNode === this) {
          input.value = HtmlUtil.htmlDecode(tar.innerHTML);
          hideSugs();
      }
      input.focus();
  }

  //字符转义模块
  var HtmlUtil = {
      /*1.用浏览器内部转换器实现html转码*/
      htmlEncode: function(html) {
          //1.首先动态创建一个容器标签元素，如DIV
          var temp = document.createElement("div");
          //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
          (temp.textContent != undefined) ? (temp.textContent = html) : (temp.innerText = html);
          //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
          var output = temp.innerHTML;
          temp = null;
          return output;
      },
      /*2.用浏览器内部转换器实现html解码*/
      htmlDecode: function(text) {
          //1.首先动态创建一个容器标签元素，如DIV
          var temp = document.createElement("div");
          //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
          temp.innerHTML = text;
          //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
          var output = temp.innerText || temp.textContent;
          temp = null;
          return output;
      },
      /*3.用正则表达式实现html转码*/
      htmlEncodeByRegExp: function(str) {
          var s = "";
          if (str.length == 0) return "";
          s = str.replace(/&/g, "&");
          s = s.replace(/</g, "<");
          s = s.replace(/>/g, ">");
          s = s.replace(/ /g, " ");
          s = s.replace(/\'/g, "\'");
          s = s.replace(/\"/g, "\"");
          return s;
      },
      /*4.用正则表达式实现html解码*/
      htmlDecodeByRegExp: function(str) {
          var s = "";
          if (str.length == 0) return "";
          s = str.replace(/&/g, "&");
          s = s.replace(/</g, "<");
          s = s.replace(/>/g, ">");
          s = s.replace(/ /g, " ");
          s = s.replace(/'/g, "\'");
          s = s.replace(/"/g, "\"");
          return s;
      }
  };