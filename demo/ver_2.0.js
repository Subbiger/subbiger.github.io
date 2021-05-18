"use strict"

let table = document.querySelector('table');

//----генерация таблицы

function generate_table(rows,colls){
    for(let i = 0; i < rows; i++){
        let row = document.createElement('tr');
        document.querySelector('table').append(row);
        for(let h = 0; h < colls; h++){
            let coll = document.createElement('td');
            row.append(coll);
        }
    }
}

//----удаление таблицы

function erase_table(){
    while(table.children.length > 0){
        table.rows[0].remove();
    }
}

//----подсчет количества ячеек

function calculate_cells(){
    let result = 0;
    for (let tabrow of table.rows){
        for (let tabcell of tabrow.cells){
            result++;
        }
    }
    return result;
}


//----генерация id у ячеек таблицы

function cells_id_generate(){
    let id_numb = 1;
    for (let tabrow of table.rows){
        for (let tabcell of tabrow.cells){
            tabcell.setAttribute('id',`${id_numb}`);
            id_numb++;
        }
    }
};
//----обновление суммы ячеек

function occupied_reload(){
    let sum = sum_calculate();
    document.querySelector('.occupied').innerHTML = sum;
}

//----генерация кастомного аттрибута

function menu_attr_generate(){
    let i = 1
    for (let menu_option of document.querySelectorAll('.menu_img')){
        menu_option.setAttribute('data-menu', i)
        i++
    }
};

//----расчет общего количества ячеек под текстуры
function sum_calculate(){
    let sum = 0;
    for (let input of document.querySelectorAll('.graph input[type = "number"]')){
        sum += +input.value;
    }
    return sum;
}


//----проверка на соответствие общей суммы введенных данных и количества ячеек

function sum_check(){
    let sum = 0;
    for (let input of document.querySelectorAll('.graph input[type = "number"]')){
        sum += +input.value;
        if (sum > +document.querySelector('.in_table').innerHTML){
            alert('Ошибка ввода, сумма ячеек зарезервированных под текстуры больше общего количества ячеек!');
            return 'failure';
        } else {
            continue;
        }
    }
    return 'success';
}

//----генератор псевдослучайных чисел

function random_generation(min, max) {
  return Math.round (min + Math.random() * (max - min));
}
function table_clear(){
    for (let tabrow of table.rows){
        for (let tabcell of tabrow.cells){
            tabcell.setAttribute('data-texture','0');
            for (let name of tabcell.classList){
            tabcell.classList.remove(name);
            }
        }
    }
}

//----основная функция генерации случайного узора

function fill(){

    let sum_result = sum_check();

    if (sum_result == "success"){
        let input_percentages_array = [];
        let texture_numbers = [];
        for (let texture_bar of document.querySelector('.graph').children){
            texture_numbers.push(texture_bar.getAttribute('data-menu'));
            input_percentages_array.push(Math.round(+texture_bar.querySelector('input[type="number"]').value));
        }
        table_clear();
        let cell_count = calculate_cells();

        for (let texture_i = 0; texture_i < texture_numbers.length; texture_i++){
            //console.log('----------------texture' + texture_numbers[texture_i]);
            for (let cell_i = 0, random_id; cell_i < +input_percentages_array[texture_i]; cell_i++){
                random_id = random_generation(1, cell_count);
                let cell = document.getElementById(random_id);
                if (cell.getAttribute('data-texture')=='0'){
                    cell.classList.add(`texture${texture_numbers[texture_i]}`);
                    cell.setAttribute('data-texture',`${texture_numbers[texture_i]}`);
                    //console.log(random_id);
                } else {
                    //console.log('dupe ' + random_id);
                    cell_i--;
                }
                
            }
        }
    } else {
        return;
    }

}

//----функция для поддержки цикличности при удалении с рабочей области (добавляет элемент текстуры обратно в меню выбора)

function revive(number){
    let revived_menu = document.createElement('img');
    revived_menu.setAttribute('src',`img/${number}.jpg`);
    revived_menu.classList.add('menu_img');
    document.querySelector('.add_menu_textures').append(revived_menu);
    revived_menu.addEventListener('click', function(){
        add_texture_bar(number);
        revived_menu.remove();
        if (document.querySelector('.add_menu_textures').children.length == 0){
            document.querySelector('.add_menu').classList.remove('add_menu_show');
            document.querySelector('.back').classList.add('hidden');
        };
    });
}

//----генерация элемента текстуры на рабочей области

function add_texture_bar(number){
    let texture_bar = document.createElement('div');
    texture_bar.setAttribute('data-menu', number);
    texture_bar.innerHTML = `<img src="img/${number}.jpg" class="tile_image"> 
    <input type="range" name="percentage" min="0" max="100">
    <input type="number" min = "0" max = "100"> <p>ячеек</p>`;
    document.querySelector('.graph').append(texture_bar);
    let remove_texture_button = document.createElement('div');
    remove_texture_button.setAttribute('data-menu', number);
    remove_texture_button.innerHTML = '<img class = "close_img" src="img/x.png">';
    remove_texture_button.classList.add('remove');
    texture_bar.append(remove_texture_button);
    remove_texture_button.addEventListener('click', function(){
        document.querySelector(`.graph > div[data-menu="${number}"]`).remove();
        slider_correction();
        occupied_reload();
        revive(number);
    });   
    slider_control();
    occupied_reload();
    slider_correction();
}

//----синхронизация слайдеров со значениями в текстовых областях

function slider_control(){
    for(let bar of document.querySelectorAll('.graph > div[data-menu]')){
        let slider = bar.querySelector('input[type="range"]');
        let output = bar.querySelector('input[type="number"]');
        output.value = slider.value;
        slider.addEventListener('input', function(){
            output.value = slider.value;
            occupied_reload();
        });
        output.addEventListener('input', function(){
            slider.value = output.value;
            occupied_reload();
        });
        output.addEventListener('change', function(){
            if(+output.value > 100){
                output.value = 100;
                slider.value = output.value;
                occupied_reload();
            }
            if(+output.value < 0){
                output.value = 0;
                slider.value = output.value;
                occupied_reload();
            }
            if(output.value == ''){
                output.value = 0;
                slider.value = output.value;
                occupied_reload();
            }
        });
    }

}

//----прозрачность для событий

function opacity_i(selector){
    document.querySelector(selector).style.opacity = 0;
    for(let i = 0; i < 10; i++){
        setInterval(() => {
            document.querySelector(selector).style.opacity = 1;
        }, 200);
    }
}

//----корректировка значений слайдеров при генерации таблицы/добавлении/удалении текстуры

function slider_correction(){
    let bar = document.querySelectorAll('.graph > div[data-menu]');
    let cell_quantity = calculate_cells();
    for(let div of bar){
        let slider = div.querySelector('input[type="range"]');
        let number = div.querySelector('input[type="number"]');
        let slider_quantity = document.querySelectorAll('input[type="range"]').length;
        number.value = Math.round(cell_quantity / slider_quantity);
        number.setAttribute("max", `${cell_quantity}`);
        slider.value = number.value;
        slider.setAttribute("max", `${cell_quantity}`);
    }
    let sum = sum_calculate();
    if (sum < cell_quantity && document.querySelectorAll('.graph > div[data-menu]').length > 0){
        for(let i = sum; i < cell_quantity;i++){
            document.querySelectorAll('input[type="number"]')[0].value++;
            document.querySelectorAll('input[type="range"]')[0].value++;    
            sum = sum_calculate();
        }
    }
    let input_numb = 0;  
    if (sum > cell_quantity && document.querySelectorAll('.graph > div[data-menu]').length > 0){
        for(let i = sum; i > cell_quantity;i--){
            if(document.querySelectorAll('input[type="number"]')[input_numb].value == 0){
                input_numb++
                document.querySelectorAll('input[type="number"]')[input_numb].value--;
                document.querySelectorAll('input[type="range"]')[input_numb].value--; 
            } else {
                document.querySelectorAll('input[type="number"]')[0].value--;
                document.querySelectorAll('input[type="range"]')[0].value--; 
            }
 
            sum = sum_calculate();
        }
    }
    for (let div of bar){
        let slider = div.querySelector('input[type="range"]');
        let number = div.querySelector('input[type="number"]');
        slider.value = number.value;
        number.value = slider.value;
    }
    occupied_reload();
}


//----генерация таблицы при загрузке страницы

erase_table();
let overall_cell_number = +document.querySelector('select').value;
generate_table(Math.sqrt(overall_cell_number),Math.sqrt(overall_cell_number));
cells_id_generate();
document.querySelector('.in_table').innerHTML = calculate_cells(); 
slider_correction();


//----события
menu_attr_generate();  

document.querySelector('select').addEventListener('change', function(){
    erase_table();
    let overall_cell_number = +document.querySelector('select').value;
    generate_table(Math.sqrt(overall_cell_number),Math.sqrt(overall_cell_number));
    cells_id_generate();
    document.querySelector('.in_table').innerHTML = calculate_cells(); 
    slider_correction();
});

document.addEventListener('pointerdown', function(event){
    switch(event.target){
        case document.querySelector('.generate'):
            event.preventDefault();
            document.querySelector('.generate').classList.add('button_down_green');
            break;
        case document.querySelector('.add_texture'):
            event.preventDefault();
            document.querySelector('.add_texture').classList.add('button_down');
            break;
        case document.querySelector('.full_clear'):
            event.preventDefault();
            document.querySelector('.full_clear').classList.add('button_down');
            break;
    }
});
document.addEventListener('pointerup', function(event){
    switch(event.target){
        case document.querySelector('.generate'):
            event.preventDefault();
            document.querySelector('.generate').classList.remove('button_down_green');
            break;
        case document.querySelector('.add_texture'):
            event.preventDefault();
            document.querySelector('.add_texture').classList.remove('button_down');
            break;
        case document.querySelector('.full_clear'):
            event.preventDefault();
            document.querySelector('.full_clear').classList.remove('button_down');
            break;
    }
});
document.addEventListener('pointerout', function(event){
    switch(event.target){
        case document.querySelector('.generate'):
            event.preventDefault();
            document.querySelector('.generate').classList.remove('button_down_green');
            break;
        case document.querySelector('.add_texture'):
            event.preventDefault();
            document.querySelector('.add_texture').classList.remove('button_down');
            break;
        case document.querySelector('.full_clear'):
            event.preventDefault();
            document.querySelector('.full_clear').classList.remove('button_down');
            break;
    }
});

document.querySelector('.generate').addEventListener('click', fill);

document.querySelector('.add_texture').addEventListener('click', function(){
    if (document.querySelector('.add_menu_textures').children.length != 0){
        document.querySelector('.add_menu').classList.add('add_menu_show');
        opacity_i('.add_menu');
        document.querySelector('.back').classList.remove('hidden');
    } else {
        alert('Уже добавлены все текстуры');
    };
});

for (let menu_button of document.querySelectorAll('.menu_img')){
    menu_button.addEventListener('click', function(){
        add_texture_bar(menu_button.getAttribute('data-menu'));
        menu_button.remove();
        if (document.querySelector('.add_menu_textures').children.length == 0){
            document.querySelector('.add_menu').classList.remove('add_menu_show');
            document.querySelector('.back').classList.add('hidden');
        };
    })
}

document.querySelector('.close').addEventListener('click', function(){
    document.querySelector('.add_menu').classList.remove('add_menu_show');
    document.querySelector('.back').classList.add('hidden');
});

document.querySelector('.full_clear').addEventListener('click', function(){
    table_clear();
    for(let bar of document.querySelectorAll('.graph > div[data-menu]')){
        let number = bar.getAttribute('data-menu');
        bar.remove();
        revive(number);
    }
    occupied_reload();
});

document.querySelector('.back').addEventListener('pointerdown', function(event){
    if(event.target == document.querySelector('.back')){
        document.querySelector('.add_menu').classList.remove('add_menu_show');
        document.querySelector('.back').classList.add('hidden');
    }
});