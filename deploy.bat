@echo off
REM Deploy React build to S3

REM Set your bucket name and region
set BUCKET=myfinalyear-project
set REGION=ap-south-1

REM Remove old files from S3 (optional, for a clean deploy)
aws s3 rm s3://%BUCKET%/ --recursive --region %REGION%

REM Upload new build files
aws s3 cp dist s3://%BUCKET%/ --recursive --region %REGION%

REM Print website URL
echo.
echo Deployment complete!
echo Your site should be live at:
echo https://%BUCKET%.s3-website-%REGION%.amazonaws.com
pause
