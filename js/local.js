
async function loadAdminState() {
    const { data: { session } } = await supabaseclient.auth.getSession();
    if (!session || !session.user) {
        window.location.href = '/Login.html';
        return;
    }

    const authUid = session.user.id;
    const { data: user, error: userError } = await supabaseclient
        .from('usuario')
        .select('id, admin')
        .eq('auth_uid', authUid)
        .single();

    if (userError || !user) {
        console.error('No se pudo obtener usuario:', userError);
        alert('No se pudo recuperar información del usuario. Inicia sesión de nuevo.');
        localStorage.removeItem('userId');
        window.location.href = '/Login.html';
        return;
    }

    const isAdmin = user.admin === true;
    setupMenu(isAdmin);

    if (isAdmin) {
        await localall(true);
    } else {
        await localall(false, user.id);
    }
}

async function localall(isAdmin = false, userId = null) {
    let locales = [];

    if (isAdmin) {
        const { data, error } = await supabaseclient
            .from('local')
            .select('*');

        if (error) {
            console.error('Error al conectar:', error.message);
        } else {
            locales = data;
        }
    } else {
        const { data: permisos, error: permisosError } = await supabaseclient
            .from('permisos')
            .select('id_local')
            .eq('id_usuario', userId);

        if (permisosError) {
            console.error('Error obteniendo permisos:', permisosError.message);
        } else {
            const ids = permisos.map(p => p.id_local);
            if (ids.length > 0) {
                const { data, error } = await supabaseclient
                    .from('local')
                    .select('*')
                    .in('id', ids);

                if (error) {
                    console.error('Error al cargar locales permitidos:', error.message);
                } else {
                    locales = data;
                }
            }
        }
    }

    window.locales = locales;
    renderLocales(locales);
}

function setupMenu(isAdmin) {
    const adminMenu = document.getElementById('adminMenu');
    const menuBtn = document.getElementById('menuBtn');

    if (isAdmin) {
        // adminMenu starts closed
        const toggleMenu = () => {
            adminMenu.classList.toggle('open');
            document.body.classList.toggle('sidebar-open');
        };
        menuBtn.addEventListener('click', toggleMenu);
        document.getElementById('closeMenu').addEventListener('click', toggleMenu);
        document.getElementById('manageUsers').addEventListener('click', () => {
            window.location.href = '/UserManagement.html';
        });
    } else {
        adminMenu.classList.remove('open');
        menuBtn.style.display = 'none';
    }

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await supabaseclient.auth.signOut();
        localStorage.removeItem('userId');
        window.location.href = '/Login.html';
    });
}

function renderLocales(locales) {
    // Mostrar los datos en el HTML
    const contenedor = document.getElementById('localGroup');
    contenedor.innerHTML = '';

   
    locales.forEach(local => {
        //diseño de las tarjetas con los datos obtenidos
        const card = `
            <div style="display: flex; align-items: center; margin: 10px;">
                <div class="card-local" style="border: 1px solid #ccc; margin: 10px; padding: 15px; border-radius: 8px; flex: 1;">
                    <a href="/CheckList.html?localId=${local.id}">${local.nombre}</a>
                    <h3>${local.id}</h3>
                </div>
                <button onclick="window.location.href='/CheckList.html?localId=${local.id}';" style="margin-left: 10px; background: #800000; color: white; border: none; padding: 10px; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; cursor: pointer;">+</button>
            </div>
        `;
        contenedor.innerHTML += card;
    });
}

async function GetAllFromLocal(IdLocal) {
    const { data, error } = await supabaseclient
        .from('local')
        .select('*')
        .eq('id', IdLocal);

    if (error) {
        console.error('Error al conectar:', error.message);
    } else {
        console.log('Conexión exitosa. Datos:', data);
    }

    window.locales = data; // Guardar datos globalmente
    renderLocales(data);
}

loadAdminState();

document.getElementById('searchInput').addEventListener('input', () => {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = window.locales.filter(local => local.nombre.toLowerCase().includes(query));
    renderLocales(filtered);
});