export default async (req, context) => {
    const api = Netlify.env.get('APPS_SCRIPT');
    
    const res = await fetch(api, {
        redirect: 'follow'
    });
    const { data } = await res.json();

    return new Response(JSON.stringify(data));
};