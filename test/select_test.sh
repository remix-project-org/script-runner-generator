
#!/bin/bash
# Bash Menu Script Example

PS3='Select a remix version to test against: '
BROWSERS=( "local" "live" )
select opt in "${BROWSERS[@]}"
do
    case $opt in
        "local")
            echo "local remix selected"
            BROWSER="--local"
            break
            ;;
        "live")
            echo "live remix selected"
            BROWSER=""
            break
            ;;
        "exit")
            echo "Exiting"
            exit 0
            ;;
        *) echo "invalid option $REPLY";;
    esac
done
yarn run build:e2e
PS3='Select a test or command: '
TESTFILES=( $(find ./dist/tests -type f -name '*.js' ! -exec grep -q "'@disabled': \?true" {} \; -print | sort) )

# Create an array to store the base names of the test files for the menu
TESTFILES_DISPLAY=()
for file in "${TESTFILES[@]}"; do
    TESTFILES_DISPLAY+=("$(basename "$file")")
done

# Add options to the menu
TESTFILES_DISPLAY+=("list")
TESTFILES_DISPLAY+=("exit")

PS3='Select a test or command: '
select opt in "${TESTFILES_DISPLAY[@]}"
do
    if [ "$opt" = "exit" ]; then
        break
    fi
    if [ "$opt" = "list" ]; then
        for i in "${!TESTFILES_DISPLAY[@]}"; do 
            printf "%s) %s\n" "$((i+1))" "${TESTFILES_DISPLAY[$i]}"
        done
    else
        # Run the corresponding test by matching the selected option with the full path in TESTFILES
        index=$((REPLY-1))
        if [ $index -lt ${#TESTFILES[@]} ]; then
            ./run_tests.sh $BROWSER --test "${TESTFILES[$index]}"
        fi
    fi
done
