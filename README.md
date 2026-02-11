# AmneziaWG for OpenWrt

[![GitHub Release](https://img.shields.io/github/v/release/S1lenix/awg-openwrt?include_prereleases&label=Release)](https://github.com/S1lenix/awg-openwrt/releases)  
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/S1lenix/awg-openwrt/build-module.yml?label=Build)](https://github.com/S1lenix/awg-openwrt/actions)  
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Описание

Это форк оригинального репозитория [Slava-Shchipunov/awg-openwrt](https://github.com/Slava-Shchipunov/awg-openwrt), адаптированный для поддержки OpenWrt версии 25.12.0-rc4 под архитектурой qualcommax/ipq807x. Основная цель - предоставить готовые пакеты AmneziaWG (kmod-amneziawg, amneziawg-tools, luci-proto-amneziawg и luci-i18n-amneziawg-ru) в формате .apk для этой платформы. Репозиторий создан для личного использования, но если вам нужно, можете форкнуть и собрать пакеты под свою архитектуру, указав нужные параметры в workflow (он универсальный и поддерживает любую поддерживаемую в OpenWrt архитектуру).

AmneziaWG - это улучшенный WireGuard с дополнительными функциями для обхода цензуры и повышения приватности. Подробнее о протоколе можно узнать в [официальной документации Amnezia](https://amnezia.org/).

**Важно:** Это не официальный репозиторий. Все изменения сделаны для удобства с qualcommax/ipq807x (для роутеров вроде Xiaomi AX3600, ZTE MF269, NETGEAR RAX120, Linksys MX4200, ASUS RT-AX89X или аналогичных). Если вы используете другую архитектуру, вернитесь к оригиналу или адаптируйте форк под себя.

## Поддерживаемые версии и архитектуры

- **OpenWrt версия:** 25.12.0-rc4 (и потенциально другие 25.x с минимальными изменениями)
- **Target/Subtarget:** qualcommax/ipq807x
- **Формат пакетов:** .apk (из-за перехода OpenWrt на apk в 25.x)

Для других архитектур (например, mediatek/filogic) проверьте форки вроде [pro100it/awg-openwrt](https://github.com/pro100it/awg-openwrt) или [tkkost/awg-openwrt](https://github.com/tkkost/awg-openwrt).

## Установка

### Автоматическая установка через скрипт

1. Подключитесь к вашему роутеру по SSH.
2. Выполните команду для скачивания и запуска скрипта установки:

   ```bash
   wget -O - https://raw.githubusercontent.com/S1lenix/awg-openwrt/master/amneziawg-install.sh | sh
   ```

   Скрипт автоматически определит вашу версию OpenWrt и архитектуру, скачает нужные .apk из релизов этого репозитория и установит их с помощью `apk add`.

### Ручная установка

1. Перейдите в [Releases](https://github.com/S1lenix/awg-openwrt/releases) и скачайте .apk-файлы для вашей версии (например, из релиза v25.12.0-rc4).
2. Перенесите файлы на роутер (например, через SCP).
3. Установите пакеты:

   ```bash
   apk add --allow-untrusted kmod-amneziawg_*.apk amneziawg-tools_*.apk luci-proto-amneziawg_*.apk luci-i18n-amneziawg-ru_*.apk
   ```

4. Перезагрузите роутер или сервис: `/etc/init.d/network restart`.

### Требования

- OpenWrt 25.12.0-rc4 (или совместимая) на qualcommax/ipq807x.
- Если возникнут ошибки зависимостей (например, kernel), скачайте kernel.apk с [downloads.openwrt.org](https://downloads.openwrt.org/releases/25.12.0-rc4/targets/qualcommax/ipq807x/kmods/).

## Сборка пакетов

Если нужно собрать пакеты для другой версии или архитектуры:

1. Форкните этот репозиторий.
2. Перейдите в Actions и запустите workflow "Create Release on Tag".
3. Укажите параметры: version (например, 25.12.0-rc4), targets (qualcommax), subtargets (ipq807x).
4. Через 10-15 минут пакеты появятся в Releases.

Подробности в [.github/workflows/build-module.yml](.github/workflows/build-module.yml).

## Лицензия

Этот проект распространяется под лицензией MIT, как и оригинал.

Благодарности: @Slava-Shchipunov за оригинальный код, @pro100it за вдохновение на адаптацию для 25.x.
