/**
 *
 * Copyright 2016-present reading
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
export const formatDateString = (timestamp) => {
  const date = new Date(parseInt(timestamp) * 1000);
  const year = date.getFullYear();
  const month = parseInt(date.getMonth()) + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

export function formatTime(ntime,sec=false)
{
  if(typeof(ntime)!="number")
  {
    try{
      ntime = parseInt(ntime);
      if(isNaN(ntime))
      {
        return "";
      } 
    }
    catch(e)
    {
      return "";
    }
  }
  let dt = new Date(ntime);
  return (dt.getFullYear()+'-'+add0(dt.getMonth()+1)+'-'+add0(dt.getDate())+' '+add0(dt.getHours())+':'+add0(dt.getMinutes()) + (sec?':'+add0(dt.getSeconds()):""))
}
/**处理时间函数*/
function add0(m){return m<10?'0'+m:m }

export const formatStringWithHtml = (originString) => {
  const newString = originString.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  return newString;
};
