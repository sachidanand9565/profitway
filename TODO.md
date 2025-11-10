# TODO: Fix Mobile Checkout Payment Submission Failure

## Steps to Complete
- [x] Add file size validation (max 5MB) in file input onChange
- [x] Implement image compression function (resize to max 800px width, quality 0.8)
- [x] Update fileToBase64 to use compression before base64
- [ ] Enhance error handling in handlePayNow with specific mobile-related messages
- [ ] Test the changes on mobile device/simulator
- [ ] Verify API handles compressed images correctly
