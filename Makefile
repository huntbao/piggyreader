make:
	@echo "Kill Chrome"
	@taskkill /f /im chrome.exe /fi "STATUS eq RUNNING"
	@echo "Restart Chrome"
	@chrome.exe --no-sandbox
