from setuptools import setup

setup(
    name='$nakesGame',
    version='1.0',
    long_description="Snakes competitve online clone game",
    packages=['$nakes'],
    include_package_data=True,
    zip_safe=False,
    install_requires=['Flask', 'asyncio']
)