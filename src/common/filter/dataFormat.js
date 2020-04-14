export function dataFormat (date,fmt='yyyy/MM/DD hh:mm:ss') {
    date=new Date(date*1000)

    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length))

    }
    
    const o={
        'M+':(date.getMonth()+1+'').padStart(2,'0'),
        'D+':(date.getDate()+'').padStart(2,'0'),
        'h+':(date.getHours()+'').padStart(2,'0'),
        'm+':(date.getMinutes()+'').padStart(2,'0'),
        's+':(date.getSeconds()+'').padStart(2,'0')
    }
    for( let k in o ){
        if(new RegExp(`(${k})`).test(fmt)){
            fmt=fmt.replace(RegExp.$1,o[k])
        }
    }
    
return fmt
    // let year=date.getFullYear()+''
    // let MM=(date.getMonth()+1+'').padStart(2,'0')
    // let DD=(date.getDate()+'').padStart(2,'0')
    // let hh=(date.getHours()+'').padStart(2,'0')
    // let mm=(date.getMinutes()+'').padStart(2,'0')
    // let ss=(date.getSeconds()+'').padStart(2,'0')

// return `${year}/${MM}/${DD} ${hh}:${mm}:${ss}`
}

