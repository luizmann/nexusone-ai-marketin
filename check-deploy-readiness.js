// 🚀 NEXUSONE AI - TESTE DE PREPARAÇÃO PARA DEPLOY
// ================================================

console.log('🚀 Verificando preparação do NexusOne AI para deploy...\n');

// Verificar arquivos essenciais
const fs = require('fs');
const path = require('path');

const requiredFiles = [
    'package.json',
    'index.html',
    'src/App.tsx',
    'src/index.css',
    'vite.config.ts',
    'tailwind.config.js'
];

const requiredDirs = [
    'src',
    'src/components',
    'src/pages',
    'src/contexts',
    'supabase',
    'supabase/functions'
];

let allGood = true;

console.log('📁 Verificando estrutura de arquivos...');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - AUSENTE!`);
        allGood = false;
    }
});

console.log('\n📂 Verificando diretórios...');
requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`✅ ${dir}/`);
    } else {
        console.log(`❌ ${dir}/ - AUSENTE!`);
        allGood = false;
    }
});

// Verificar Edge Functions
console.log('\n🔧 Verificando Edge Functions...');
const functionsDir = 'supabase/functions';
if (fs.existsSync(functionsDir)) {
    const functions = fs.readdirSync(functionsDir)
        .filter(item => fs.statSync(path.join(functionsDir, item)).isDirectory())
        .filter(item => !item.startsWith('_') && item !== 'README.md');
    
    console.log(`📊 Total de Edge Functions: ${functions.length}`);
    functions.forEach(func => {
        console.log(`   🔹 ${func}`);
    });
} else {
    console.log('❌ Diretório de functions não encontrado!');
    allGood = false;
}

// Verificar package.json
console.log('\n📦 Verificando dependências...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
        'react',
        'react-dom',
        '@supabase/supabase-js',
        'openai',
        'tailwindcss',
        'vite'
    ];
    
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
            console.log(`✅ ${dep}`);
        } else {
            console.log(`❌ ${dep} - AUSENTE!`);
            allGood = false;
        }
    });
} catch (error) {
    console.log('❌ Erro ao ler package.json');
    allGood = false;
}

// Verificar arquivos de configuração
console.log('\n⚙️ Verificando configurações...');
const configFiles = [
    { file: '.env.example', required: true },
    { file: '.env.local', required: false },
    { file: 'deploy-config.json', required: true },
    { file: 'vercel.json', required: false }
];

configFiles.forEach(({ file, required }) => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        if (required) {
            console.log(`❌ ${file} - AUSENTE!`);
            allGood = false;
        } else {
            console.log(`⚠️ ${file} - Opcional`);
        }
    }
});

// Resultado final
console.log('\n' + '='.repeat(50));
if (allGood) {
    console.log('🎉 PROJETO PRONTO PARA DEPLOY!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Configure suas variáveis de ambiente (.env.local)');
    console.log('2. Execute: npm run deploy:vercel');
    console.log('3. Deploy das Edge Functions no Supabase');
    console.log('\n📖 Consulte DEPLOY_MANUAL_GUIDE.md para instruções detalhadas');
} else {
    console.log('❌ PROJETO NÃO ESTÁ PRONTO PARA DEPLOY!');
    console.log('Corrija os problemas listados acima antes de fazer o deploy.');
}
console.log('='.repeat(50));

// Estatísticas do projeto
console.log('\n📊 Estatísticas do projeto:');
try {
    // Contar arquivos .tsx/.ts
    const countFiles = (dir, extensions) => {
        if (!fs.existsSync(dir)) return 0;
        let count = 0;
        const traverse = (currentPath) => {
            const items = fs.readdirSync(currentPath);
            items.forEach(item => {
                const itemPath = path.join(currentPath, item);
                const stat = fs.statSync(itemPath);
                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    traverse(itemPath);
                } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
                    count++;
                }
            });
        };
        traverse(dir);
        return count;
    };
    
    const tsxFiles = countFiles('src', ['.tsx', '.ts']);
    const cssFiles = countFiles('src', ['.css']);
    
    console.log(`   📄 Arquivos TypeScript/React: ${tsxFiles}`);
    console.log(`   🎨 Arquivos CSS: ${cssFiles}`);
    
    // Contar componentes
    const componentsDir = 'src/components';
    if (fs.existsSync(componentsDir)) {
        const components = countFiles(componentsDir, ['.tsx']);
        console.log(`   🧩 Componentes React: ${components}`);
    }
    
    // Contar páginas
    const pagesDir = 'src/pages';
    if (fs.existsSync(pagesDir)) {
        const pages = countFiles(pagesDir, ['.tsx']);
        console.log(`   📱 Páginas: ${pages}`);
    }
    
    console.log(`   ⚡ Edge Functions: ${functions ? functions.length : 0}`);
    
} catch (error) {
    console.log('   ⚠️ Não foi possível calcular estatísticas');
}

console.log('\n🚀 NexusOne AI - Sistema de automação com IA pronto!');