'use sctrict';

const main = () =>
{
    const connectButton = document.getElementById('ConnectButton');

    connectButton.addEventListener('click', () =>
    {
        window.open('page.html', '_blank');
    });
};

main();
