## PASSWORD RESET STEPS

- We need to create a link through which user can reset his password (This link is normally available in the login page )
- We need to develop a component where user can provide his email address and submit it to reset his password.
- We also need to develop another component where user can enter his new password and confirm password.
- We will send an email containing a link with token on user's verified email address.
    - This part will happen on backend side
    - we need to develop some kind of end point for it and controller
    - We need to generate a token that must expire as soon as user has changed his password using it once
    - In controller we need to implement send-grid to send email.
    - We need to develop a end-point and controller where we can verify that token and allow user to change his password
    

    ### Problem in above scenario will Occur:

    - That as we are using one static jwt key for generating the token and verifying it
    - that means if the user has reset the password once using the sent link , he can use the same link
        to reset the password again.

    ## How to solve this problem
    
    - That when we are generating the token for reset password we will not use the standard jwt key that we are using for all other private end points
    - instead of that we will generate that token using the hashed password of the user
    - What will be the advantage:
        - That once user has successfully changed his password using the given link and token
        - Then his hashed password value will be changed in database
        - and if he again tries to reset the password using the old link and token 
        - jwt. verify method want the same key with which we have generated the token
        - as password is already reset that means it is changed
        - so the new hashed password will not match the old one
        - that means jwt keys will be changed and verification of the token will be failed