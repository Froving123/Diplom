# Установка политики выполнения
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Включение экспериментов Firebase
firebase experiments:enable webframeworks

# Развертывание Firebase
firebase deploy