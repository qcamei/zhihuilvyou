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

export const naviGoBack = (navigator) =>
{
    if (navigator && navigator.getCurrentRoutes().length > 1)
    {
        navigator.pop();
        return true;
    }
    
    return true;
};
/**两个对象是否相等---简单比较，不能有函数等等... */
export function isEqual(a, b)
{
    if (a != undefined && b == undefined)
        return false;
    if (typeof (a) == "object")
    {
        let c={};
        for (var s in a)
        {
            if (a[s]==a || a[s]==b || !isEqual(a[s], b[s]))
            {
                return false;
            }
            c[s]=true;
        }
        for (var s in b)
        {
            if (!c[s] && (a[s]==a || a[s]==b || !isEqual(b[s], a[s])))
            {
                return false;
            }
        }
        return true;
    }
    else return a == b ? true : false;
}