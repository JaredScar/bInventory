fx_version 'cerulean'
game 'gta5'

author 'bCore Development'
description 'Advanced Inventory System for QBCore'
version '1.0.0'

shared_scripts {
    '@qb-core/shared/locale.lua',
    'locales/en.lua',
    'config.lua'
}

client_scripts {
    'client/main.lua',
    'client/events.lua',
    'client/functions.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'server/events.lua',
    'server/functions.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js',
    'html/images/*.png',
    'html/images/*.jpg',
    'html/images/*.svg',
    'html/assets/*.png',
    'html/assets/*.jpg',
    'html/assets/*.svg'
}

lua54 'yes'

dependencies {
    'qb-core',
    'oxmysql'
}
